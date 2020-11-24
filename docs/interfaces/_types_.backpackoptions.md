**[node-pixel-async](../README.md)**

> [Globals](../globals.md) / ["types"](../modules/_types_.md) / BackpackOptions

# Interface: BackpackOptions

## Hierarchy

* [BaseStripOptions](_types_.basestripoptions.md)

  ↳ **BackpackOptions**

## Index

### Properties

* [address](_types_.backpackoptions.md#address)
* [board](_types_.backpackoptions.md#board)
* [color\_order](_types_.backpackoptions.md#color_order)
* [controller](_types_.backpackoptions.md#controller)
* [firmata](_types_.backpackoptions.md#firmata)
* [gamma](_types_.backpackoptions.md#gamma)
* [length](_types_.backpackoptions.md#length)
* [strips](_types_.backpackoptions.md#strips)

## Properties

### address

•  **address**: number

*Defined in [lib/types.ts:76](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/types.ts#L76)*

___

### board

• `Optional` **board**: JohnnyBoard

*Inherited from [BaseStripOptions](_types_.basestripoptions.md).[board](_types_.basestripoptions.md#board)*

*Defined in [lib/types.ts:69](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/types.ts#L69)*

___

### color\_order

•  **color\_order**: *typeof* [GRB](../modules/_constants_.md#grb) \| *typeof* [BRG](../modules/_constants_.md#brg) \| *typeof* [RGB](../modules/_constants_.md#rgb)

*Inherited from [BaseStripOptions](_types_.basestripoptions.md).[color_order](_types_.basestripoptions.md#color_order)*

*Defined in [lib/types.ts:67](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/types.ts#L67)*

___

### controller

• `Optional` **controller**: \"FIRMATA\" \| \"I2CBACKPACK\"

*Inherited from [BaseStripOptions](_types_.basestripoptions.md).[controller](_types_.basestripoptions.md#controller)*

*Defined in [lib/types.ts:70](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/types.ts#L70)*

___

### firmata

• `Optional` **firmata**: Board

*Inherited from [BaseStripOptions](_types_.basestripoptions.md).[firmata](_types_.basestripoptions.md#firmata)*

*Defined in [lib/types.ts:68](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/types.ts#L68)*

___

### gamma

•  **gamma**: number

*Inherited from [BaseStripOptions](_types_.basestripoptions.md).[gamma](_types_.basestripoptions.md#gamma)*

*Defined in [lib/types.ts:65](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/types.ts#L65)*

___

### length

•  **length**: number

*Inherited from [BaseStripOptions](_types_.basestripoptions.md).[length](_types_.basestripoptions.md#length)*

*Defined in [lib/types.ts:66](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/types.ts#L66)*

___

### strips

• `Optional` **strips**: number[] \| string[] \| [StripConfig](../modules/_types_.md#stripconfig)[]

*Defined in [lib/types.ts:77](https://github.com/hweeks/node-pixel-async/blob/94dca3b/lib/types.ts#L77)*
