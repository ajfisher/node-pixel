**[node-pixel-async](../README.md)**

> [Globals](../globals.md) / ["pixel/firmata"](../modules/_pixel_firmata_.md) / FirmataPixel

# Class: FirmataPixel

## Hierarchy

* [Pixel](_pixel_pixel_.pixel.md)

  ↳ **FirmataPixel**

## Index

### Constructors

* [constructor](_pixel_firmata_.firmatapixel.md#constructor)

### Properties

* [internalPixel](_pixel_firmata_.firmatapixel.md#internalpixel)
* [sendmsg](_pixel_firmata_.firmatapixel.md#sendmsg)

### Methods

* [color](_pixel_firmata_.firmatapixel.md#color)
* [colour](_pixel_firmata_.firmatapixel.md#colour)
* [createPayload](_pixel_firmata_.firmatapixel.md#createpayload)
* [createPixel](_pixel_firmata_.firmatapixel.md#createpixel)
* [fillPixel](_pixel_firmata_.firmatapixel.md#fillpixel)
* [off](_pixel_firmata_.firmatapixel.md#off)

## Constructors

### constructor

\+ **new FirmataPixel**(`opts`: [FirmataPixelOptions](../interfaces/_types_.firmatapixeloptions.md)): [FirmataPixel](_pixel_firmata_.firmatapixel.md)

*Overrides [Pixel](_pixel_pixel_.pixel.md).[constructor](_pixel_pixel_.pixel.md#constructor)*

*Defined in [lib/pixel/firmata.ts:13](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/pixel/firmata.ts#L13)*

#### Parameters:

Name | Type |
------ | ------ |
`opts` | [FirmataPixelOptions](../interfaces/_types_.firmatapixeloptions.md) |

**Returns:** [FirmataPixel](_pixel_firmata_.firmatapixel.md)

## Properties

### internalPixel

•  **internalPixel**: [FirmataBasePixel](../interfaces/_types_.firmatabasepixel.md)

*Overrides [Pixel](_pixel_pixel_.pixel.md).[internalPixel](_pixel_pixel_.pixel.md#internalpixel)*

*Defined in [lib/pixel/firmata.ts:12](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/pixel/firmata.ts#L12)*

___

### sendmsg

•  **sendmsg**: boolean

*Overrides [Pixel](_pixel_pixel_.pixel.md).[sendmsg](_pixel_pixel_.pixel.md#sendmsg)*

*Defined in [lib/pixel/firmata.ts:13](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/pixel/firmata.ts#L13)*

## Methods

### color

▸ **color**(`color?`: string \| [number, number, number], `optOverride?`: undefined \| { sendmsg: boolean  }): void \| [PixelColor](../interfaces/_types_.pixelcolor.md)

*Inherited from [Pixel](_pixel_pixel_.pixel.md).[color](_pixel_pixel_.pixel.md#color)*

*Defined in [lib/pixel/pixel.ts:39](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/pixel/pixel.ts#L39)*

#### Parameters:

Name | Type |
------ | ------ |
`color?` | string \| [number, number, number] |
`optOverride?` | undefined \| { sendmsg: boolean  } |

**Returns:** void \| [PixelColor](../interfaces/_types_.pixelcolor.md)

___

### colour

▸ **colour**(`color?`: string \| [number, number, number], `optOverride?`: undefined \| { sendmsg: boolean  }): void \| [PixelColor](../interfaces/_types_.pixelcolor.md)

*Inherited from [Pixel](_pixel_pixel_.pixel.md).[colour](_pixel_pixel_.pixel.md#colour)*

*Defined in [lib/pixel/pixel.ts:91](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/pixel/pixel.ts#L91)*

#### Parameters:

Name | Type |
------ | ------ |
`color?` | string \| [number, number, number] |
`optOverride?` | undefined \| { sendmsg: boolean  } |

**Returns:** void \| [PixelColor](../interfaces/_types_.pixelcolor.md)

___

### createPayload

▸ **createPayload**(`colorAsNumber`: number): number[]

*Defined in [lib/pixel/firmata.ts:32](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/pixel/firmata.ts#L32)*

#### Parameters:

Name | Type |
------ | ------ |
`colorAsNumber` | number |

**Returns:** number[]

___

### createPixel

▸ **createPixel**(`opts`: [FirmataPixelOptions](../interfaces/_types_.firmatapixeloptions.md)): [FirmataBasePixel](../interfaces/_types_.firmatabasepixel.md)

*Overrides [Pixel](_pixel_pixel_.pixel.md).[createPixel](_pixel_pixel_.pixel.md#createpixel)*

*Defined in [lib/pixel/firmata.ts:19](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/pixel/firmata.ts#L19)*

#### Parameters:

Name | Type |
------ | ------ |
`opts` | [FirmataPixelOptions](../interfaces/_types_.firmatapixeloptions.md) |

**Returns:** [FirmataBasePixel](../interfaces/_types_.firmatabasepixel.md)

___

### fillPixel

▸ **fillPixel**(`inputColor`: number): void

*Overrides [Pixel](_pixel_pixel_.pixel.md).[fillPixel](_pixel_pixel_.pixel.md#fillpixel)*

*Defined in [lib/pixel/firmata.ts:46](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/pixel/firmata.ts#L46)*

#### Parameters:

Name | Type |
------ | ------ |
`inputColor` | number |

**Returns:** void

___

### off

▸ **off**(): void

*Inherited from [Pixel](_pixel_pixel_.pixel.md).[off](_pixel_pixel_.pixel.md#off)*

*Defined in [lib/pixel/pixel.ts:94](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/pixel/pixel.ts#L94)*

**Returns:** void
