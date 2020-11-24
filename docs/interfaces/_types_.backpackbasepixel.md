**[node-pixel-async](../README.md)**

> [Globals](../globals.md) / ["types"](../modules/_types_.md) / BackpackBasePixel

# Interface: BackpackBasePixel

## Hierarchy

* [BuiltPixelBase](_types_.builtpixelbase.md)

  ↳ **BackpackBasePixel**

## Index

### Properties

* [address](_types_.backpackbasepixel.md#address)
* [color](_types_.backpackbasepixel.md#color)
* [i2c\_address](_types_.backpackbasepixel.md#i2c_address)
* [id](_types_.backpackbasepixel.md#id)
* [io](_types_.backpackbasepixel.md#io)
* [parent](_types_.backpackbasepixel.md#parent)

## Properties

### address

•  **address**: number

*Inherited from [BuiltPixelBase](_types_.builtpixelbase.md).[address](_types_.builtpixelbase.md#address)*

*Defined in [lib/types.ts:22](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/types.ts#L22)*

___

### color

•  **color**: [PixelColor](_types_.pixelcolor.md)

*Inherited from [BuiltPixelBase](_types_.builtpixelbase.md).[color](_types_.builtpixelbase.md#color)*

*Defined in [lib/types.ts:24](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/types.ts#L24)*

___

### i2c\_address

•  **i2c\_address**: number

*Defined in [lib/types.ts:59](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/types.ts#L59)*

___

### id

•  **id**: number

*Inherited from [BuiltPixelBase](_types_.builtpixelbase.md).[id](_types_.builtpixelbase.md#id)*

*Defined in [lib/types.ts:23](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/types.ts#L23)*

___

### io

•  **io**: { i2cWrite: (address: number, color: number[]) => void  }

*Defined in [lib/types.ts:56](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/types.ts#L56)*

#### Type declaration:

Name | Type |
------ | ------ |
`i2cWrite` | (address: number, color: number[]) => void |

___

### parent

•  **parent**: { gtable: number[]  }

*Inherited from [BuiltPixelBase](_types_.builtpixelbase.md).[parent](_types_.builtpixelbase.md#parent)*

*Defined in [lib/types.ts:25](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/types.ts#L25)*

#### Type declaration:

Name | Type |
------ | ------ |
`gtable` | number[] |
