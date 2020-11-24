**[node-pixel-async](../README.md)**

> [Globals](../globals.md) / ["types"](../modules/_types_.md) / FirmataPixelOptions

# Interface: FirmataPixelOptions

## Hierarchy

* [PixelOptions](_types_.pixeloptions.md)

  ↳ **FirmataPixelOptions**

## Index

### Properties

* [addr](_types_.firmatapixeloptions.md#addr)
* [controller](_types_.firmatapixeloptions.md#controller)
* [firmata](_types_.firmatapixeloptions.md#firmata)
* [port](_types_.firmatapixeloptions.md#port)
* [sendmsg](_types_.firmatapixeloptions.md#sendmsg)
* [strip](_types_.firmatapixeloptions.md#strip)

## Properties

### addr

•  **addr**: number

*Defined in [lib/types.ts:31](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/types.ts#L31)*

___

### controller

•  **controller**: \"FIRMATA\" \| \"I2CBACKPACK\"

*Inherited from [PixelOptions](_types_.pixeloptions.md).[controller](_types_.pixeloptions.md#controller)*

*Defined in [lib/types.ts:8](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/types.ts#L8)*

___

### firmata

•  **firmata**: unknown

*Defined in [lib/types.ts:32](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/types.ts#L32)*

___

### port

•  **port**: { write: (message: Buffer) => void  }

*Defined in [lib/types.ts:33](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/types.ts#L33)*

#### Type declaration:

Name | Type |
------ | ------ |
`write` | (message: Buffer) => void |

___

### sendmsg

• `Optional` **sendmsg**: undefined \| false \| true

*Inherited from [PixelOptions](_types_.pixeloptions.md).[sendmsg](_types_.pixeloptions.md#sendmsg)*

*Defined in [lib/types.ts:9](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/types.ts#L9)*

___

### strip

•  **strip**: [FirmataStrip](../classes/_strip_firmata_.firmatastrip.md) \| [BackpackStrip](../classes/_strip_backpack_.backpackstrip.md)

*Defined in [lib/types.ts:36](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/types.ts#L36)*
