export interface PixelOptions {
  controller: 'FIRMATA' | 'I2CBACKPACK'
  sendmsg?: boolean
}

export interface PixelColor {
  r: number
  g: number
  b: number
  hexcode: string
  color: string
  rgb: [number, number, number]
}

export interface BuiltPixelBase {
  address: number
  id: number
  color: PixelColor
  parent: {
    gtable: number[]
  }
}

export interface FirmataPixelOptions extends PixelOptions {
  addr: number
  firmata: unknown
  port: {
    write: (message: Buffer) => void
  }
  strip: any // replace with strip type
}

export interface FirmataBasePixel extends BuiltPixelBase {
  firmata: unknown
  port: {
    write: (message: Buffer) => void
  }
}

export interface BackpackPixelOptions extends PixelOptions {
  addr: number
  io: {
    i2cWrite: (address: number, color: number[]) => void
  }
  i2c_address: number
  strip: any // replace with strip type
}

export interface BackpackBasePixel extends BuiltPixelBase {
  io: {
    i2cWrite: (address: number, color: number[]) => void
  }
  i2c_address: number
}
