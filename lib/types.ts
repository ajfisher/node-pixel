import { COLOR_ORDER } from "./constants";
import {Board as JohnnyBoard} from 'johnny-five';
import Board from "firmata";
import { FirmataStrip } from "./strip/firmata";
import { BackpackStrip } from "./strip/backpack";
import { Strip } from "./strip/strip";

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
  rgb: [number, number, number, number?]
}

export interface BuiltPixelBase {
  address: number
  id: number
  color: PixelColor
  parent: Strip
}

export interface FirmataPixelOptions extends PixelOptions {
  addr: number
  firmata: unknown
  port: {
    write: (message: Buffer) => void
  }
  strip: FirmataStrip | BackpackStrip // replace with strip type
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
  strip: FirmataStrip | BackpackStrip // replace with strip type
}

export interface BackpackBasePixel extends BuiltPixelBase {
  io: {
    i2cWrite: (address: number, color: number[]) => void
  }
  i2c_address: number
}

// Strip Types

export interface ChannelTransformRequest {
  maximum: number,
  gamma?: number
}

export interface ChannelTransform {
  maximum: number,
  gamma: number,
  g_table: number[]
}

export type ChannelTransformArray = [ChannelTransform, ChannelTransform, ChannelTransform]

export interface BaseStripOptions {
  gamma: number
  length?: number
  color_order?: typeof COLOR_ORDER.GRB | typeof COLOR_ORDER.BRG | typeof COLOR_ORDER.RGB
  firmata?: Board
  board?: JohnnyBoard
  controller?: 'FIRMATA' | 'I2CBACKPACK'
  whiteCap?: [ChannelTransformRequest, ChannelTransformRequest, ChannelTransformRequest]
}

export type StripConfig = {pin?: number, color_order?: number, length: number}

export interface BackpackOptions extends BaseStripOptions {
  address?: number
  strips?: number[] | string[] | StripConfig[]
}

export interface FirmataOptions extends BaseStripOptions {
  data: number
  strips?: number[] | string[] | StripConfig[]
  skip_firmware_check: boolean
}
