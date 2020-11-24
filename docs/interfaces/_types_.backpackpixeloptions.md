**[node-pixel-async](../README.md)**

> [Globals](../globals.md) / ["types"](../modules/_types_.md) / BackpackPixelOptions

# Interface: BackpackPixelOptions

## Hierarchy

* [PixelOptions](_types_.pixeloptions.md)

  ↳ **BackpackPixelOptions**

## Index

### Properties

* [addr](_types_.backpackpixeloptions.md#addr)
* [controller](_types_.backpackpixeloptions.md#controller)
* [i2c\_address](_types_.backpackpixeloptions.md#i2c_address)
* [io](_types_.backpackpixeloptions.md#io)
* [sendmsg](_types_.backpackpixeloptions.md#sendmsg)
* [strip](_types_.backpackpixeloptions.md#strip)

## Properties

### addr

•  **addr**: number

*Defined in [lib/types.ts:47](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/types.ts#L47)*

___

### controller

•  **controller**: \"FIRMATA\" \| \"I2CBACKPACK\"

*Inherited from [PixelOptions](_types_.pixeloptions.md).[controller](_types_.pixeloptions.md#controller)*

*Defined in [lib/types.ts:8](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/types.ts#L8)*

___

### i2c\_address

•  **i2c\_address**: number

*Defined in [lib/types.ts:51](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/types.ts#L51)*

___

### io

•  **io**: { i2cWrite: (address: number, color: number[]) => void  }

*Defined in [lib/types.ts:48](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/types.ts#L48)*

#### Type declaration:

Name | Type |
------ | ------ |
`i2cWrite` | (address: number, color: number[]) => void |

___

### sendmsg

• `Optional` **sendmsg**: undefined \| false \| true

*Inherited from [PixelOptions](_types_.pixeloptions.md).[sendmsg](_types_.pixeloptions.md#sendmsg)*

*Defined in [lib/types.ts:9](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/types.ts#L9)*

___

### strip

•  **strip**: [FirmataStrip](../classes/_strip_firmata_.firmatastrip.md) \| [BackpackStrip](../classes/_strip_backpack_.backpackstrip.md)

*Defined in [lib/types.ts:52](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/types.ts#L52)*
