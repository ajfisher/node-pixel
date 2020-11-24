**[node-pixel-async](../README.md)**

> [Globals](../globals.md) / ["pixel/backpack"](../modules/_pixel_backpack_.md) / BackpackPixel

# Class: BackpackPixel

## Hierarchy

* [Pixel](_pixel_pixel_.pixel.md)

  ↳ **BackpackPixel**

## Index

### Constructors

* [constructor](_pixel_backpack_.backpackpixel.md#constructor)

### Properties

* [internalPixel](_pixel_backpack_.backpackpixel.md#internalpixel)
* [sendmsg](_pixel_backpack_.backpackpixel.md#sendmsg)

### Methods

* [color](_pixel_backpack_.backpackpixel.md#color)
* [colour](_pixel_backpack_.backpackpixel.md#colour)
* [createPayload](_pixel_backpack_.backpackpixel.md#createpayload)
* [createPixel](_pixel_backpack_.backpackpixel.md#createpixel)
* [fillPixel](_pixel_backpack_.backpackpixel.md#fillpixel)
* [off](_pixel_backpack_.backpackpixel.md#off)

## Constructors

### constructor

\+ **new BackpackPixel**(`opts`: [BackpackPixelOptions](../interfaces/_types_.backpackpixeloptions.md)): [BackpackPixel](_pixel_backpack_.backpackpixel.md)

*Overrides [Pixel](_pixel_pixel_.pixel.md).[constructor](_pixel_pixel_.pixel.md#constructor)*

*Defined in [lib/pixel/backpack.ts:11](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/pixel/backpack.ts#L11)*

#### Parameters:

Name | Type |
------ | ------ |
`opts` | [BackpackPixelOptions](../interfaces/_types_.backpackpixeloptions.md) |

**Returns:** [BackpackPixel](_pixel_backpack_.backpackpixel.md)

## Properties

### internalPixel

•  **internalPixel**: [BackpackBasePixel](../interfaces/_types_.backpackbasepixel.md)

*Overrides [Pixel](_pixel_pixel_.pixel.md).[internalPixel](_pixel_pixel_.pixel.md#internalpixel)*

*Defined in [lib/pixel/backpack.ts:10](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/pixel/backpack.ts#L10)*

___

### sendmsg

•  **sendmsg**: boolean

*Overrides [Pixel](_pixel_pixel_.pixel.md).[sendmsg](_pixel_pixel_.pixel.md#sendmsg)*

*Defined in [lib/pixel/backpack.ts:11](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/pixel/backpack.ts#L11)*

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

*Defined in [lib/pixel/backpack.ts:30](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/pixel/backpack.ts#L30)*

#### Parameters:

Name | Type |
------ | ------ |
`colorAsNumber` | number |

**Returns:** number[]

___

### createPixel

▸ **createPixel**(`opts`: [BackpackPixelOptions](../interfaces/_types_.backpackpixeloptions.md)): [BackpackBasePixel](../interfaces/_types_.backpackbasepixel.md)

*Overrides [Pixel](_pixel_pixel_.pixel.md).[createPixel](_pixel_pixel_.pixel.md#createpixel)*

*Defined in [lib/pixel/backpack.ts:17](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/pixel/backpack.ts#L17)*

#### Parameters:

Name | Type |
------ | ------ |
`opts` | [BackpackPixelOptions](../interfaces/_types_.backpackpixeloptions.md) |

**Returns:** [BackpackBasePixel](../interfaces/_types_.backpackbasepixel.md)

___

### fillPixel

▸ **fillPixel**(`inputColor`: number): void

*Overrides [Pixel](_pixel_pixel_.pixel.md).[fillPixel](_pixel_pixel_.pixel.md#fillpixel)*

*Defined in [lib/pixel/backpack.ts:41](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/pixel/backpack.ts#L41)*

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
