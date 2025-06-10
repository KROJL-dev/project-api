import * as fs from 'node:fs'
import * as path from 'node:path'
import FormData from 'form-data'
import { PassThrough } from 'stream'
import axios from 'axios'
import aws4 from 'aws4'
import ffmpeg from 'fluent-ffmpeg'

import crypto from 'crypto'

export function formToBuffer(
  form: FormData
): Promise<{ buffer: Buffer; headers: Record<string, string> }> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    const stream = form.pipe(new PassThrough())

    stream.on('data', chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)))
    stream.on('end', () => resolve({ buffer: Buffer.concat(chunks), headers: form.getHeaders() }))
    stream.on('error', reject)
  })
}

export async function sendToSageMaker(wavPath: string): Promise<string> {
  const form = new FormData()
  const audioStream = fs.createReadStream(wavPath)

  form.append('file', audioStream, {
    filename: path.basename(wavPath),
    contentType: 'audio/wav',
  })

  const { buffer: bodyBuffer, headers: formHeaders } = await formToBuffer(form)

  const { hostname, pathname } = new URL(
    'https://runtime.sagemaker.us-east-1.amazonaws.com/endpoints/lexi-ai-endpoint/invocations'
  )

  const requestOptions = {
    host: hostname,
    method: 'POST',
    path: pathname,
    service: 'sagemaker',
    region: 'us-east-1',
    headers: {
      ...formHeaders,
      'x-amz-content-sha256': crypto.createHash('sha256').update(bodyBuffer).digest('hex'),
    },
    body: bodyBuffer,
  }

  aws4.sign(requestOptions, {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  })

  try {
    const start = Date.now()
    const response = await axios.post(`https://${hostname}${pathname}`, bodyBuffer, {
      headers: requestOptions.headers,
      maxBodyLength: Number.POSITIVE_INFINITY,
    })
    const end = Date.now()
    const duration = ((end - start) / 1000).toFixed(2)
    console.log(`✅ Запрос к SageMaker выполнен за ${duration} секунд`)
    console.log('Response from SageMaker:', response.data)
    return JSON.stringify(response.data, null, 2)
  } catch (error) {
    console.error('Error sending request to SageMaker:', error)
    if (axios.isAxiosError(error)) {
      console.error('Response:', error.response?.data)
    }
    throw error
  }
}

export async function convertToWav(webmPath: string, wavPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    ffmpeg(webmPath)
      .audioChannels(1)
      .audioFrequency(16000)
      .format('wav')
      .save(wavPath)
      .on('end', () => resolve(wavPath))
      .on('error', reject)
  })
}
