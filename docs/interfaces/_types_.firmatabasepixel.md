**[node-pixel-async](../README.md)**

> [Globals](../globals.md) / ["types"](../modules/_types_.md) / FirmataBasePixel

# Interface: FirmataBasePixel

## Hierarchy

* [BuiltPixelBase](_types_.builtpixelbase.md)

  ↳ **FirmataBasePixel**

## Index

### Properties

* [address](_types_.firmatabasepixel.md#address)
* [color](_types_.firmatabasepixel.md#color)
* [firmata](_types_.firmatabasepixel.md#firmata)
* [id](_types_.firmatabasepixel.md#id)
* [parent](_types_.firmatabasepixel.md#parent)
* [port](_types_.firmatabasepixel.md#port)

## Properties

### address

•  **address**: number

*Inherited from [BuiltPixelBase](_types_.builtpixelbase.md).[address](_types_.builtpixelbase.md#address)*

*Defined in [lib/types.ts:22](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/types.ts#L22)*

___

### color

•  **color**: [PixelColor](_types_.pixelcolor.md)

*Inherited from [BuiltPixelBase](_types_.builtpixelbase.md).[color](_types_.builtpixelbase.md#color)*

*Defined in [lib/types.ts:24](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/types.ts#L24)*

___

### firmata

•  **firmata**: unknown

*Defined in [lib/types.ts:40](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/types.ts#L40)*

___

### id

•  **id**: number

*Inherited from [BuiltPixelBase](_types_.builtpixelbase.md).[id](_types_.builtpixelbase.md#id)*

*Defined in [lib/types.ts:23](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/types.ts#L23)*

___

### parent

•  **parent**: { gtable: number[]  }

*Inherited from [BuiltPixelBase](_types_.builtpixelbase.md).[parent](_types_.builtpixelbase.md#parent)*

*Defined in [lib/types.ts:25](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/types.ts#L25)*

#### Type declaration:

Name | Type |
------ | ------ |
`gtable` | number[] |

___

### port

•  **port**: { write: (message: Buffer) => void  }

*Defined in [lib/types.ts:41](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/types.ts#L41)*

#### Type declaration:

Name | Type |
------ | ------ |
`write` | (message: Buffer) => void |
