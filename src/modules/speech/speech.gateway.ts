import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets'
import { sendToSageMaker, convertToWav } from './audio.utils'
import { Server, Socket } from 'socket.io'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'
import * as ffmpeg from 'fluent-ffmpeg'
import { randomUUID } from 'node:crypto'

@WebSocketGateway({ cors: true })
export class SpeechGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private clientBuffers: Map<string, Buffer[]> = new Map()

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`)
    client.emit('connected', 1)
    this.clientBuffers.set(client.id, [])
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`)
    this.processClientAudio(client)
  }

  @SubscribeMessage('audio')
  handleAudioStream(@MessageBody() data: Buffer, @ConnectedSocket() client: Socket) {
    if (!this.clientBuffers.has(client.id)) {
      this.clientBuffers.set(client.id, [])
    }

    const bufferArray = this.clientBuffers.get(client.id)
    console.log(' ')
    console.log('data', data)
    console.log(' ')
    // this.clientBuffers.set(client.id, Buffer.concat(data))
    bufferArray?.push(data)
  }

  @SubscribeMessage('stop')
  async handleStopRecording(@ConnectedSocket() client: Socket) {
    console.log(`Stop message received from: ${client.id}`)
    await this.processClientAudio(client)
    client.disconnect(true)
  }

  private processedClients = new Set<string>()

  private async processClientAudio(client: Socket) {
    if (this.processedClients.has(client.id)) {
      console.log(`⚠️ Audio already processed for client ${client.id}`)
      return
    }
    this.processedClients.add(client.id)

    const bufferChunks = this.clientBuffers.get(client.id)
    this.clientBuffers.delete(client.id)

    if (!bufferChunks || bufferChunks.length === 0) {
      console.warn(`No audio received for client ${client.id}`)
      return
    }

    console.log('bufferChunks', bufferChunks)
    const buffer = Buffer.concat(bufferChunks)
    console.log('buffer', buffer)
    console.log(`🧠 Получено аудио: ${bufferChunks.length} чанков, ${buffer.length} байт`)
    if (buffer.length < 1000) {
      console.warn(`Audio buffer too small to process for client ${client.id}`)
      return
    }

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'audio-'))
    const inputPath = path.join(tmpDir, `${randomUUID()}.webm`)
    const outputPath = path.join(tmpDir, `${randomUUID()}.wav`)

    fs.writeFileSync(inputPath, buffer)
    console.log('✅ Файл записан в:', inputPath)
    console.log('📦 Размер файла:', fs.statSync(inputPath).size)

    try {
      await convertToWav(inputPath, outputPath)
      console.log(`✅ Файл сконвертирован: ${outputPath}`)

      const text = await sendToSageMaker(outputPath)
      console.log('📝 Распознанный текст:', text)

      const audioData = fs.readFileSync(outputPath)
      client.emit('audio-file', {
        name: 'output.wav',
        data: buffer,
      })
    } catch (error) {
      console.error('❌ Ошибка при обработке аудио:', error)
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  }
}
