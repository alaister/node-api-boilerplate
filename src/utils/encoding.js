export function base64(i) {
  return Buffer.from(i, 'utf8').toString('base64')
}

export function unbase64(i) {
  return Buffer.from(i, 'base64').toString('utf8')
}
