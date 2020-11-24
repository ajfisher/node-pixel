**[node-pixel-async](../README.md)**

> [Globals](../globals.md) / ["pixel/pixel"](../modules/_pixel_pixel_.md) / Pixel

# Class: Pixel

## Hierarchy

* **Pixel**

  ↳ [BackpackPixel](_pixel_backpack_.backpackpixel.md)

  ↳ [FirmataPixel](_pixel_firmata_.firmatapixel.md)

## Index

### Constructors

* [constructor](_pixel_pixel_.pixel.md#constructor)

### Properties

* [internalPixel](_pixel_pixel_.pixel.md#internalpixel)
* [sendmsg](_pixel_pixel_.pixel.md#sendmsg)

### Methods

* [color](_pixel_pixel_.pixel.md#color)
* [colour](_pixel_pixel_.pixel.md#colour)
* [createPixel](_pixel_pixel_.pixel.md#createpixel)
* [fillPixel](_pixel_pixel_.pixel.md#fillpixel)
* [off](_pixel_pixel_.pixel.md#off)

## Constructors

### constructor

\+ **new Pixel**(`opts`: [PixelInit](../modules/_pixel_pixel_.md#pixelinit)): [Pixel](_pixel_pixel_.pixel.md)

*Defined in [lib/pixel/pixel.ts:26](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/pixel/pixel.ts#L26)*

#### Parameters:

Name | Type |
------ | ------ |
`opts` | [PixelInit](../modules/_pixel_pixel_.md#pixelinit) |

**Returns:** [Pixel](_pixel_pixel_.pixel.md)

## Properties

### internalPixel

•  **internalPixel**: [BasePixelConfiguration](../modules/_pixel_pixel_.md#basepixelconfiguration)

*Defined in [lib/pixel/pixel.ts:25](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/pixel/pixel.ts#L25)*

___

### sendmsg

•  **sendmsg**: boolean

*Defined in [lib/pixel/pixel.ts:26](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/pixel/pixel.ts#L26)*

## Methods

### color

▸ **color**(`color?`: string \| [number, number, number], `optOverride?`: undefined \| { sendmsg: boolean  }): void \| [PixelColor](../interfaces/_types_.pixelcolor.md)

*Defined in [lib/pixel/pixel.ts:39](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/pixel/pixel.ts#L39)*

#### Parameters:

Name | Type |
------ | ------ |
`color?` | string \| [number, number, number] |
`optOverride?` | undefined \| { sendmsg: boolean  } |

**Returns:** void \| [PixelColor](../interfaces/_types_.pixelcolor.md)

___

### colour

▸ **colour**(`color?`: string \| [number, number, number], `optOverride?`: undefined \| { sendmsg: boolean  }): void \| [PixelColor](../interfaces/_types_.pixelcolor.md)

*Defined in [lib/pixel/pixel.ts:91](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/pixel/pixel.ts#L91)*

#### Parameters:

Name | Type |
------ | ------ |
`color?` | string \| [number, number, number] |
`optOverride?` | undefined \| { sendmsg: boolean  } |

**Returns:** void \| [PixelColor](../interfaces/_types_.pixelcolor.md)

___

### createPixel

▸ **createPixel**(`opts`: [PixelInit](../modules/_pixel_pixel_.md#pixelinit)): [BasePixelConfiguration](../modules/_pixel_pixel_.md#basepixelconfiguration)

*Defined in [lib/pixel/pixel.ts:32](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/pixel/pixel.ts#L32)*

#### Parameters:

Name | Type |
------ | ------ |
`opts` | [PixelInit](../modules/_pixel_pixel_.md#pixelinit) |

**Returns:** [BasePixelConfiguration](../modules/_pixel_pixel_.md#basepixelconfiguration)

___

### fillPixel

▸ **fillPixel**(`inputColor`: number): void

*Defined in [lib/pixel/pixel.ts:36](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/pixel/pixel.ts#L36)*

#### Parameters:

Name | Type |
------ | ------ |
`inputColor` | number |

**Returns:** void

___

### off

▸ **off**(): void

*Defined in [lib/pixel/pixel.ts:94](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/pixel/pixel.ts#L94)*

**Returns:** void
