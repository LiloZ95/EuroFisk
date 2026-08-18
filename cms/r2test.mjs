import 'dotenv/config'
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
const s3 = new S3Client({
  region: 'auto', endpoint: process.env.R2_ENDPOINT, forcePathStyle: true,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
})
const Bucket = process.env.R2_BUCKET
const Key = '_cms-connectivity-check.txt'
const show = (l,e) => console.log(`${l} FAILED: ${e.name} | ${e.message}`)
try { const r = await s3.send(new ListObjectsV2Command({ Bucket, MaxKeys: 1 })); console.log('LIST  OK — objects in bucket:', r.KeyCount ?? 0) } catch(e){ show('LIST',e) }
try { await s3.send(new PutObjectCommand({ Bucket, Key, Body: 'ok', ContentType: 'text/plain' })); console.log('WRITE OK') } catch(e){ show('WRITE',e); process.exit(1) }
try { await s3.send(new GetObjectCommand({ Bucket, Key })); console.log('READ  OK') } catch(e){ show('READ',e) }
const pub = process.env.R2_PUBLIC_URL.replace(/\/$/,'') + '/' + Key
try {
  const r = await fetch(pub)
  console.log('PUBLIC', r.status, r.ok ? 'OK — visitors can load files' : '<-- NOT public; enable public access on the bucket')
} catch(e){ console.log('PUBLIC FAILED:', e.message) }
try { await s3.send(new DeleteObjectCommand({ Bucket, Key })); console.log('DELETE OK (cleaned up)') } catch(e){ show('DELETE',e) }
