**[node-pixel-async](../README.md)**

> [Globals](../globals.md) / ["types"](../modules/_types_.md) / FirmataOptions

# Interface: FirmataOptions

## Hierarchy

* [BaseStripOptions](_types_.basestripoptions.md)

  ↳ **FirmataOptions**

## Index

### Properties

* [board](_types_.firmataoptions.md#board)
* [color\_order](_types_.firmataoptions.md#color_order)
* [controller](_types_.firmataoptions.md#controller)
* [data](_types_.firmataoptions.md#data)
* [firmata](_types_.firmataoptions.md#firmata)
* [gamma](_types_.firmataoptions.md#gamma)
* [length](_types_.firmataoptions.md#length)
* [skip\_firmware\_check](_types_.firmataoptions.md#skip_firmware_check)
* [strips](_types_.firmataoptions.md#strips)

## Properties

### board

• `Optional` **board**: JohnnyBoard

*Inherited from [BaseStripOptions](_types_.basestripoptions.md).[board](_types_.basestripoptions.md#board)*

*Defined in [lib/types.ts:69](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/types.ts#L69)*

___

### color\_order

•  **color\_order**: *typeof* [GRB](../modules/_constants_.md#grb) \| *typeof* [BRG](../modules/_constants_.md#brg) \| *typeof* [RGB](../modules/_constants_.md#rgb)

*Inherited from [BaseStripOptions](_types_.basestripoptions.md).[color_order](_types_.basestripoptions.md#color_order)*

*Defined in [lib/types.ts:67](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/types.ts#L67)*

___

### controller

• `Optional` **controller**: \"FIRMATA\" \| \"I2CBACKPACK\"

*Inherited from [BaseStripOptions](_types_.basestripoptions.md).[controller](_types_.basestripoptions.md#controller)*

*Defined in [lib/types.ts:70](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/types.ts#L70)*

___

### data

•  **data**: number

*Defined in [lib/types.ts:81](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/types.ts#L81)*

___

### firmata

• `Optional` **firmata**: Board

*Inherited from [BaseStripOptions](_types_.basestripoptions.md).[firmata](_types_.basestripoptions.md#firmata)*

*Defined in [lib/types.ts:68](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/types.ts#L68)*

___

### gamma

•  **gamma**: number

*Inherited from [BaseStripOptions](_types_.basestripoptions.md).[gamma](_types_.basestripoptions.md#gamma)*

*Defined in [lib/types.ts:65](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/types.ts#L65)*

___

### length

•  **length**: number

*Inherited from [BaseStripOptions](_types_.basestripoptions.md).[length](_types_.basestripoptions.md#length)*

*Defined in [lib/types.ts:66](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/types.ts#L66)*

___

### skip\_firmware\_check

•  **skip\_firmware\_check**: boolean

*Defined in [lib/types.ts:83](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/types.ts#L83)*

___

### strips

• `Optional` **strips**: number[] \| string[] \| [StripConfig](../modules/_types_.md#stripconfig)[]

*Defined in [lib/types.ts:82](https://github.com/hweeks/node-pixel-async/blob/c6b1f13/lib/types.ts#L82)*
