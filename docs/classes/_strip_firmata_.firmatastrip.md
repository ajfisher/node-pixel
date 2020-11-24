**[node-pixel-async](../README.md)**

> [Globals](../globals.md) / ["strip/firmata"](../modules/_strip_firmata_.md) / FirmataStrip

# Class: FirmataStrip

## Hierarchy

* [Strip](_strip_strip_.strip.md)

  ↳ **FirmataStrip**

## Index

### Constructors

* [constructor](_strip_firmata_.firmatastrip.md#constructor)

### Properties

* [gamma](_strip_firmata_.firmatastrip.md#gamma)
* [gtable](_strip_firmata_.firmatastrip.md#gtable)
* [io](_strip_firmata_.firmatastrip.md#io)
* [length](_strip_firmata_.firmatastrip.md#length)
* [pixels](_strip_firmata_.firmatastrip.md#pixels)
* [port](_strip_firmata_.firmatastrip.md#port)

### Methods

* [\_shift](_strip_firmata_.firmatastrip.md#_shift)
* [addListener](_strip_firmata_.firmatastrip.md#addlistener)
* [color](_strip_firmata_.firmatastrip.md#color)
* [colour](_strip_firmata_.firmatastrip.md#colour)
* [emit](_strip_firmata_.firmatastrip.md#emit)
* [eventNames](_strip_firmata_.firmatastrip.md#eventnames)
* [getLength](_strip_firmata_.firmatastrip.md#getlength)
* [getMaxListeners](_strip_firmata_.firmatastrip.md#getmaxlisteners)
* [listenerCount](_strip_firmata_.firmatastrip.md#listenercount)
* [listeners](_strip_firmata_.firmatastrip.md#listeners)
* [off](_strip_firmata_.firmatastrip.md#off)
* [on](_strip_firmata_.firmatastrip.md#on)
* [once](_strip_firmata_.firmatastrip.md#once)
* [pixel](_strip_firmata_.firmatastrip.md#pixel)
* [prependListener](_strip_firmata_.firmatastrip.md#prependlistener)
* [prependOnceListener](_strip_firmata_.firmatastrip.md#prependoncelistener)
* [rawListeners](_strip_firmata_.firmatastrip.md#rawlisteners)
* [removeAllListeners](_strip_firmata_.firmatastrip.md#removealllisteners)
* [removeListener](_strip_firmata_.firmatastrip.md#removelistener)
* [setMaxListeners](_strip_firmata_.firmatastrip.md#setmaxlisteners)
* [shift](_strip_firmata_.firmatastrip.md#shift)
* [show](_strip_firmata_.firmatastrip.md#show)
* [stripColor](_strip_firmata_.firmatastrip.md#stripcolor)

## Constructors

### constructor

\+ **new FirmataStrip**(`opts`: [FirmataOptions](../interfaces/_types_.firmataoptions.md)): [FirmataStrip](_strip_firmata_.firmatastrip.md)

*Overrides [Strip](_strip_strip_.strip.md).[constructor](_strip_strip_.strip.md#constructor)*

*Defined in [lib/strip/firmata.ts:12](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/firmata.ts#L12)*

#### Parameters:

Name | Type |
------ | ------ |
`opts` | [FirmataOptions](../interfaces/_types_.firmataoptions.md) |

**Returns:** [FirmataStrip](_strip_firmata_.firmatastrip.md)

## Properties

### gamma

•  **gamma**: number

*Inherited from [Strip](_strip_strip_.strip.md).[gamma](_strip_strip_.strip.md#gamma)*

*Defined in [lib/strip/strip.ts:11](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/strip.ts#L11)*

___

### gtable

•  **gtable**: number[]

*Inherited from [Strip](_strip_strip_.strip.md).[gtable](_strip_strip_.strip.md#gtable)*

*Defined in [lib/strip/strip.ts:10](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/strip.ts#L10)*

___

### io

•  **io**: Board \| JohnnyBoard[\"io\"]

*Defined in [lib/strip/firmata.ts:10](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/firmata.ts#L10)*

___

### length

•  **length**: number

*Overrides [Strip](_strip_strip_.strip.md).[length](_strip_strip_.strip.md#length)*

*Defined in [lib/strip/firmata.ts:12](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/firmata.ts#L12)*

___

### pixels

•  **pixels**: [Pixel](_pixel_pixel_.pixel.md)[]

*Inherited from [Strip](_strip_strip_.strip.md).[pixels](_strip_strip_.strip.md#pixels)*

*Defined in [lib/strip/strip.ts:9](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/strip.ts#L9)*

___

### port

•  **port**: { write: (message: Buffer, cb?: undefined \| (err: Error, msg?: unknown) => void) => void  }

*Defined in [lib/strip/firmata.ts:11](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/firmata.ts#L11)*

#### Type declaration:

Name | Type |
------ | ------ |
`write` | (message: Buffer, cb?: undefined \| (err: Error, msg?: unknown) => void) => void |

## Methods

### \_shift

▸ **_shift**(`amt`: number, `direction`: *typeof* SHIFT\_FORWARD \| *typeof* SHIFT\_BACKWARD, `wrap`: boolean): void

*Overrides [Strip](_strip_strip_.strip.md).[_shift](_strip_strip_.strip.md#_shift)*

*Defined in [lib/strip/firmata.ts:155](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/firmata.ts#L155)*

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

*Inherited from [Strip](_strip_strip_.strip.md).[color](_strip_strip_.strip.md#color)*

*Defined in [lib/strip/strip.ts:77](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/strip.ts#L77)*

#### Parameters:

Name | Type |
------ | ------ |
`color?` | string \| [number, number, number] |

**Returns:** void

___

### colour

▸ **colour**(`color?`: string \| [number, number, number]): void

*Inherited from [Strip](_strip_strip_.strip.md).[colour](_strip_strip_.strip.md#colour)*

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

*Inherited from [Strip](_strip_strip_.strip.md).[getLength](_strip_strip_.strip.md#getlength)*

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

*Inherited from [Strip](_strip_strip_.strip.md).[off](_strip_strip_.strip.md#off)*

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

*Inherited from [Strip](_strip_strip_.strip.md).[pixel](_strip_strip_.strip.md#pixel)*

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

*Inherited from [Strip](_strip_strip_.strip.md).[shift](_strip_strip_.strip.md#shift)*

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

*Overrides [Strip](_strip_strip_.strip.md).[show](_strip_strip_.strip.md#show)*

*Defined in [lib/strip/firmata.ts:129](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/firmata.ts#L129)*

**Returns:** void

___

### stripColor

▸ **stripColor**(`color`: number): void

*Overrides [Strip](_strip_strip_.strip.md).[stripColor](_strip_strip_.strip.md#stripcolor)*

*Defined in [lib/strip/firmata.ts:139](https://github.com/hweeks/node-pixel-async/blob/e2c8d0c/lib/strip/firmata.ts#L139)*

#### Parameters:

Name | Type |
------ | ------ |
`color` | number |

**Returns:** void
