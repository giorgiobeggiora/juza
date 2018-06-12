function isGoodString (q, bad = null) {
	return ( q && typeof q === 'string' ) ? q : bad;
}

function isGoodNumber (q, bad = null) {
	return ( q > -1 && Number.isFinite(q) ) ? q : bad;
}

function isGoodBoolean (q, bad = null) {
	return ( q === true || q === false ) ? q : bad;
}

function isString(q)    { return typeof q === 'string'; }
function isNumber(q)    { return Number.isFinite(q); }
function isBoolean(q)   { return q === true || q === false; }
function isNull(q)      { return q === null; }
function isUndefined(q) { return q === void 0; }
