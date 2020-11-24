**[node-pixel-async](../README.md)**

> [Globals](../globals.md) / ["strip/strip"](../modules/_strip_strip_.md) / Strip

# Class: Strip

## Hierarchy

* EventEmitter

  ↳ **Strip**

  ↳↳ [FirmataStrip](_strip_firmata_.firmatastrip.md)

  ↳↳ [BackpackStrip](_strip_backpack_.backpackstrip.md)

## Index

### Constructors

* [constructor](_strip_strip_.strip.md#constructor)

### Properties

* [gamma](_strip_strip_.strip.md#gamma)
* [gtable](_strip_strip_.strip.md#gtable)
* [length](_strip_strip_.strip.md#length)
* [pixels](_strip_strip_.strip.md#pixels)
* [defaultMaxListeners](_strip_strip_.strip.md#defaultmaxlisteners)
* [errorMonitor](_strip_strip_.strip.md#errormonitor)

### Methods

* [\_shift](_strip_strip_.strip.md#_shift)
* [addListener](_strip_strip_.strip.md#addlistener)
* [color](_strip_strip_.strip.md#color)
* [colour](_strip_strip_.strip.md#colour)
* [emit](_strip_strip_.strip.md#emit)
* [eventNames](_strip_strip_.strip.md#eventnames)
* [getLength](_strip_strip_.strip.md#getlength)
* [getMaxListeners](_strip_strip_.strip.md#getmaxlisteners)
* [listenerCount](_strip_strip_.strip.md#listenercount)
* [listeners](_strip_strip_.strip.md#listeners)
* [off](_strip_strip_.strip.md#off)
* [on](_strip_strip_.strip.md#on)
* [once](_strip_strip_.strip.md#once)
* [pixel](_strip_strip_.strip.md#pixel)
* [prependListener](_strip_strip_.strip.md#prependlistener)
* [prependOnceListener](_strip_strip_.strip.md#prependoncelistener)
* [rawListeners](_strip_strip_.strip.md#rawlisteners)
* [removeAllListeners](_strip_strip_.strip.md#removealllisteners)
* [removeListener](_strip_strip_.strip.md#removelistener)
* [setMaxListeners](_strip_strip_.strip.md#setmaxlisteners)
* [shift](_strip_strip_.strip.md#shift)
* [show](_strip_strip_.strip.md#show)
* [stripColor](_strip_strip_.strip.md#stripcolor)
* [listenerCount](_strip_strip_.strip.md#listenercount)

## Constructors

### constructor

\+ **new Strip**(`opts`: [BaseStripOptions](../interfaces/_types_.basestripoptions.md)): [Strip](_strip_strip_.strip.md)

*Overrides void*

*Defined in [lib/strip/strip.ts:12](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/strip.ts#L12)*

#### Parameters:

Name | Type |
------ | ------ |
`opts` | [BaseStripOptions](../interfaces/_types_.basestripoptions.md) |

**Returns:** [Strip](_strip_strip_.strip.md)

## Properties

### gamma

•  **gamma**: number

*Defined in [lib/strip/strip.ts:11](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/strip.ts#L11)*

___

### gtable

•  **gtable**: number[]

*Defined in [lib/strip/strip.ts:10](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/strip.ts#L10)*

___

### length

•  **length**: number

*Defined in [lib/strip/strip.ts:12](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/strip.ts#L12)*

___

### pixels

•  **pixels**: [Pixel](_pixel_pixel_.pixel.md)[]

*Defined in [lib/strip/strip.ts:9](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/strip.ts#L9)*

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: number

*Inherited from [Strip](_strip_strip_.strip.md).[defaultMaxListeners](_strip_strip_.strip.md#defaultmaxlisteners)*

*Defined in node_modules/@types/node/events.d.ts:45*

___

### errorMonitor

▪ `Static` `Readonly` **errorMonitor**: unique symbol

*Inherited from [Strip](_strip_strip_.strip.md).[errorMonitor](_strip_strip_.strip.md#errormonitor)*

*Defined in node_modules/@types/node/events.d.ts:55*

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

## Methods

### \_shift

▸ **_shift**(`amt`: number, `direction`: *typeof* SHIFT\_FORWARD \| *typeof* SHIFT\_BACKWARD, `wrap`: boolean): void

*Defined in [lib/strip/strip.ts:34](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/strip.ts#L34)*

#### Parameters:

Name | Type |
------ | ------ |
`amt` | number |
`direction` | *typeof* SHIFT\_FORWARD \| *typeof* SHIFT\_BACKWARD |
`wrap` | boolean |

**Returns:** void

___

### addListener

▸ **addListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [Strip](_strip_strip_.strip.md).[addListener](_strip_strip_.strip.md#addlistener)*

*Defined in node_modules/@types/node/events.d.ts:62*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### color

▸ **color**(`color?`: string \| [number, number, number]): void

*Defined in [lib/strip/strip.ts:77](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/strip.ts#L77)*

#### Parameters:

Name | Type |
------ | ------ |
`color?` | string \| [number, number, number] |

**Returns:** void

___

### colour

▸ **colour**(`color?`: string \| [number, number, number]): void

*Defined in [lib/strip/strip.ts:110](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/strip.ts#L110)*

#### Parameters:

Name | Type |
------ | ------ |
`color?` | string \| [number, number, number] |

**Returns:** void

___

### emit

▸ **emit**(`event`: string \| symbol, ...`args`: any[]): boolean

*Inherited from [Strip](_strip_strip_.strip.md).[emit](_strip_strip_.strip.md#emit)*

*Defined in node_modules/@types/node/events.d.ts:72*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`...args` | any[] |

**Returns:** boolean

___

### eventNames

▸ **eventNames**(): Array\<string \| symbol>

*Inherited from [Strip](_strip_strip_.strip.md).[eventNames](_strip_strip_.strip.md#eventnames)*

*Defined in node_modules/@types/node/events.d.ts:77*

**Returns:** Array\<string \| symbol>

___

### getLength

▸ **getLength**(): number

*Defined in [lib/strip/strip.ts:23](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/strip.ts#L23)*

**Returns:** number

___

### getMaxListeners

▸ **getMaxListeners**(): number

*Inherited from [Strip](_strip_strip_.strip.md).[getMaxListeners](_strip_strip_.strip.md#getmaxlisteners)*

*Defined in node_modules/@types/node/events.d.ts:69*

**Returns:** number

___

### listenerCount

▸ **listenerCount**(`event`: string \| symbol): number

*Inherited from [Strip](_strip_strip_.strip.md).[listenerCount](_strip_strip_.strip.md#listenercount)*

*Defined in node_modules/@types/node/events.d.ts:73*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |

**Returns:** number

___

### listeners

▸ **listeners**(`event`: string \| symbol): Function[]

*Inherited from [Strip](_strip_strip_.strip.md).[listeners](_strip_strip_.strip.md#listeners)*

*Defined in node_modules/@types/node/events.d.ts:70*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |

**Returns:** Function[]

___

### off

▸ **off**(): this

*Overrides void*

*Defined in [lib/strip/strip.ts:113](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/strip.ts#L113)*

**Returns:** this

___

### on

▸ **on**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [Strip](_strip_strip_.strip.md).[on](_strip_strip_.strip.md#on)*

*Defined in node_modules/@types/node/events.d.ts:63*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### once

▸ **once**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [Strip](_strip_strip_.strip.md).[once](_strip_strip_.strip.md#once)*

*Defined in node_modules/@types/node/events.d.ts:64*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### pixel

▸ **pixel**(`addr`: number): [Pixel](_pixel_pixel_.pixel.md) \| undefined

*Defined in [lib/strip/strip.ts:20](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/strip.ts#L20)*

#### Parameters:

Name | Type |
------ | ------ |
`addr` | number |

**Returns:** [Pixel](_pixel_pixel_.pixel.md) \| undefined

___

### prependListener

▸ **prependListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [Strip](_strip_strip_.strip.md).[prependListener](_strip_strip_.strip.md#prependlistener)*

*Defined in node_modules/@types/node/events.d.ts:75*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### prependOnceListener

▸ **prependOnceListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [Strip](_strip_strip_.strip.md).[prependOnceListener](_strip_strip_.strip.md#prependoncelistener)*

*Defined in node_modules/@types/node/events.d.ts:76*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### rawListeners

▸ **rawListeners**(`event`: string \| symbol): Function[]

*Inherited from [Strip](_strip_strip_.strip.md).[rawListeners](_strip_strip_.strip.md#rawlisteners)*

*Defined in node_modules/@types/node/events.d.ts:71*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |

**Returns:** Function[]

___

### removeAllListeners

▸ **removeAllListeners**(`event?`: string \| symbol): this

*Inherited from [Strip](_strip_strip_.strip.md).[removeAllListeners](_strip_strip_.strip.md#removealllisteners)*

*Defined in node_modules/@types/node/events.d.ts:67*

#### Parameters:

Name | Type |
------ | ------ |
`event?` | string \| symbol |

**Returns:** this

___

### removeListener

▸ **removeListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [Strip](_strip_strip_.strip.md).[removeListener](_strip_strip_.strip.md#removelistener)*

*Defined in node_modules/@types/node/events.d.ts:65*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### setMaxListeners

▸ **setMaxListeners**(`n`: number): this

*Inherited from [Strip](_strip_strip_.strip.md).[setMaxListeners](_strip_strip_.strip.md#setmaxlisteners)*

*Defined in node_modules/@types/node/events.d.ts:68*

#### Parameters:

Name | Type |
------ | ------ |
`n` | number |

**Returns:** this

___

### shift

▸ **shift**(`amt`: number, `direction`: *typeof* SHIFT\_FORWARD \| *typeof* SHIFT\_BACKWARD, `wrap`: boolean): void

*Defined in [lib/strip/strip.ts:37](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/strip.ts#L37)*

#### Parameters:

Name | Type |
------ | ------ |
`amt` | number |
`direction` | *typeof* SHIFT\_FORWARD \| *typeof* SHIFT\_BACKWARD |
`wrap` | boolean |

**Returns:** void

___

### show

▸ **show**(): void

*Defined in [lib/strip/strip.ts:30](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/strip.ts#L30)*

**Returns:** void

___

### stripColor

▸ **stripColor**(`color`: number): void

*Defined in [lib/strip/strip.ts:27](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/strip.ts#L27)*

#### Parameters:

Name | Type |
------ | ------ |
`color` | number |

**Returns:** void

___

### listenerCount

▸ `Static`**listenerCount**(`emitter`: EventEmitter, `event`: string \| symbol): number

*Inherited from [Strip](_strip_strip_.strip.md).[listenerCount](_strip_strip_.strip.md#listenercount)*

*Defined in node_modules/@types/node/events.d.ts:44*

**`deprecated`** since v4.0.0

#### Parameters:

Name | Type |
------ | ------ |
`emitter` | EventEmitter |
`event` | string \| symbol |

**Returns:** number
