var v;
(function(r) {
  r.assertEqual = (a) => {
  };
  function e(a) {
  }
  r.assertIs = e;
  function t(a) {
    throw new Error();
  }
  r.assertNever = t, r.arrayToEnum = (a) => {
    const n = {};
    for (const i of a)
      n[i] = i;
    return n;
  }, r.getValidEnumValues = (a) => {
    const n = r.objectKeys(a).filter((o) => typeof a[a[o]] != "number"), i = {};
    for (const o of n)
      i[o] = a[o];
    return r.objectValues(i);
  }, r.objectValues = (a) => r.objectKeys(a).map(function(n) {
    return a[n];
  }), r.objectKeys = typeof Object.keys == "function" ? (a) => Object.keys(a) : (a) => {
    const n = [];
    for (const i in a)
      Object.prototype.hasOwnProperty.call(a, i) && n.push(i);
    return n;
  }, r.find = (a, n) => {
    for (const i of a)
      if (n(i))
        return i;
  }, r.isInteger = typeof Number.isInteger == "function" ? (a) => Number.isInteger(a) : (a) => typeof a == "number" && Number.isFinite(a) && Math.floor(a) === a;
  function s(a, n = " | ") {
    return a.map((i) => typeof i == "string" ? `'${i}'` : i).join(n);
  }
  r.joinValues = s, r.jsonStringifyReplacer = (a, n) => typeof n == "bigint" ? n.toString() : n;
})(v || (v = {}));
var pe;
(function(r) {
  r.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(pe || (pe = {}));
const h = v.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), $ = (r) => {
  switch (typeof r) {
    case "undefined":
      return h.undefined;
    case "string":
      return h.string;
    case "number":
      return Number.isNaN(r) ? h.nan : h.number;
    case "boolean":
      return h.boolean;
    case "function":
      return h.function;
    case "bigint":
      return h.bigint;
    case "symbol":
      return h.symbol;
    case "object":
      return Array.isArray(r) ? h.array : r === null ? h.null : r.then && typeof r.then == "function" && r.catch && typeof r.catch == "function" ? h.promise : typeof Map < "u" && r instanceof Map ? h.map : typeof Set < "u" && r instanceof Set ? h.set : typeof Date < "u" && r instanceof Date ? h.date : h.object;
    default:
      return h.unknown;
  }
}, d = v.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
class E extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (s) => {
      this.issues = [...this.issues, s];
    }, this.addIssues = (s = []) => {
      this.issues = [...this.issues, ...s];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const t = e || function(n) {
      return n.message;
    }, s = { _errors: [] }, a = (n) => {
      for (const i of n.issues)
        if (i.code === "invalid_union")
          i.unionErrors.map(a);
        else if (i.code === "invalid_return_type")
          a(i.returnTypeError);
        else if (i.code === "invalid_arguments")
          a(i.argumentsError);
        else if (i.path.length === 0)
          s._errors.push(t(i));
        else {
          let o = s, l = 0;
          for (; l < i.path.length; ) {
            const c = i.path[l];
            l === i.path.length - 1 ? (o[c] = o[c] || { _errors: [] }, o[c]._errors.push(t(i))) : o[c] = o[c] || { _errors: [] }, o = o[c], l++;
          }
        }
    };
    return a(this), s;
  }
  static assert(e) {
    if (!(e instanceof E))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, v.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, s = [];
    for (const a of this.issues)
      if (a.path.length > 0) {
        const n = a.path[0];
        t[n] = t[n] || [], t[n].push(e(a));
      } else
        s.push(e(a));
    return { formErrors: s, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
E.create = (r) => new E(r);
const ne = (r, e) => {
  let t;
  switch (r.code) {
    case d.invalid_type:
      r.received === h.undefined ? t = "Required" : t = `Expected ${r.expected}, received ${r.received}`;
      break;
    case d.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(r.expected, v.jsonStringifyReplacer)}`;
      break;
    case d.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${v.joinValues(r.keys, ", ")}`;
      break;
    case d.invalid_union:
      t = "Invalid input";
      break;
    case d.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${v.joinValues(r.options)}`;
      break;
    case d.invalid_enum_value:
      t = `Invalid enum value. Expected ${v.joinValues(r.options)}, received '${r.received}'`;
      break;
    case d.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case d.invalid_return_type:
      t = "Invalid function return type";
      break;
    case d.invalid_date:
      t = "Invalid date";
      break;
    case d.invalid_string:
      typeof r.validation == "object" ? "includes" in r.validation ? (t = `Invalid input: must include "${r.validation.includes}"`, typeof r.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${r.validation.position}`)) : "startsWith" in r.validation ? t = `Invalid input: must start with "${r.validation.startsWith}"` : "endsWith" in r.validation ? t = `Invalid input: must end with "${r.validation.endsWith}"` : v.assertNever(r.validation) : r.validation !== "regex" ? t = `Invalid ${r.validation}` : t = "Invalid";
      break;
    case d.too_small:
      r.type === "array" ? t = `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "more than"} ${r.minimum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "over"} ${r.minimum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${r.minimum}` : r.type === "bigint" ? t = `Number must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${r.minimum}` : r.type === "date" ? t = `Date must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(r.minimum))}` : t = "Invalid input";
      break;
    case d.too_big:
      r.type === "array" ? t = `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "less than"} ${r.maximum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "under"} ${r.maximum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "bigint" ? t = `BigInt must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "date" ? t = `Date must be ${r.exact ? "exactly" : r.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(r.maximum))}` : t = "Invalid input";
      break;
    case d.custom:
      t = "Invalid input";
      break;
    case d.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case d.not_multiple_of:
      t = `Number must be a multiple of ${r.multipleOf}`;
      break;
    case d.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, v.assertNever(r);
  }
  return { message: t };
};
let Pe = ne;
function ze() {
  return Pe;
}
const Ue = (r) => {
  const { data: e, path: t, errorMaps: s, issueData: a } = r, n = [...t, ...a.path || []], i = {
    ...a,
    path: n
  };
  if (a.message !== void 0)
    return {
      ...a,
      path: n,
      message: a.message
    };
  let o = "";
  const l = s.filter((c) => !!c).slice().reverse();
  for (const c of l)
    o = c(i, { data: e, defaultError: o }).message;
  return {
    ...a,
    path: n,
    message: o
  };
};
function u(r, e) {
  const t = ze(), s = Ue({
    issueData: e,
    data: r.data,
    path: r.path,
    errorMaps: [
      r.common.contextualErrorMap,
      // contextual error map is first priority
      r.schemaErrorMap,
      // then schema-bound map if available
      t,
      // then global override map
      t === ne ? void 0 : ne
      // then global default map
    ].filter((a) => !!a)
  });
  r.common.issues.push(s);
}
class S {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    const s = [];
    for (const a of t) {
      if (a.status === "aborted")
        return _;
      a.status === "dirty" && e.dirty(), s.push(a.value);
    }
    return { status: e.value, value: s };
  }
  static async mergeObjectAsync(e, t) {
    const s = [];
    for (const a of t) {
      const n = await a.key, i = await a.value;
      s.push({
        key: n,
        value: i
      });
    }
    return S.mergeObjectSync(e, s);
  }
  static mergeObjectSync(e, t) {
    const s = {};
    for (const a of t) {
      const { key: n, value: i } = a;
      if (n.status === "aborted" || i.status === "aborted")
        return _;
      n.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), n.value !== "__proto__" && (typeof i.value < "u" || a.alwaysSet) && (s[n.value] = i.value);
    }
    return { status: e.value, value: s };
  }
}
const _ = Object.freeze({
  status: "aborted"
}), W = (r) => ({ status: "dirty", value: r }), R = (r) => ({ status: "valid", value: r }), _e = (r) => r.status === "aborted", ye = (r) => r.status === "dirty", D = (r) => r.status === "valid", Q = (r) => typeof Promise < "u" && r instanceof Promise;
var f;
(function(r) {
  r.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(f || (f = {}));
class O {
  constructor(e, t, s, a) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = s, this._key = a;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const ge = (r, e) => {
  if (D(e))
    return { success: !0, data: e.value };
  if (!r.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new E(r.common.issues);
      return this._error = t, this._error;
    }
  };
};
function y(r) {
  if (!r)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: s, description: a } = r;
  if (e && (t || s))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: a } : { errorMap: (i, o) => {
    const { message: l } = r;
    return i.code === "invalid_enum_value" ? { message: l ?? o.defaultError } : typeof o.data > "u" ? { message: l ?? s ?? o.defaultError } : i.code !== "invalid_type" ? { message: o.defaultError } : { message: l ?? t ?? o.defaultError };
  }, description: a };
}
class g {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return $(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: $(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new S(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: $(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (Q(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const s = this.safeParse(e, t);
    if (s.success)
      return s.data;
    throw s.error;
  }
  safeParse(e, t) {
    const s = {
      common: {
        issues: [],
        async: (t == null ? void 0 : t.async) ?? !1,
        contextualErrorMap: t == null ? void 0 : t.errorMap
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: $(e)
    }, a = this._parseSync({ data: e, path: s.path, parent: s });
    return ge(s, a);
  }
  "~validate"(e) {
    var s, a;
    const t = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: $(e)
    };
    if (!this["~standard"].async)
      try {
        const n = this._parseSync({ data: e, path: [], parent: t });
        return D(n) ? {
          value: n.value
        } : {
          issues: t.common.issues
        };
      } catch (n) {
        (a = (s = n == null ? void 0 : n.message) == null ? void 0 : s.toLowerCase()) != null && a.includes("encountered") && (this["~standard"].async = !0), t.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: t }).then((n) => D(n) ? {
      value: n.value
    } : {
      issues: t.common.issues
    });
  }
  async parseAsync(e, t) {
    const s = await this.safeParseAsync(e, t);
    if (s.success)
      return s.data;
    throw s.error;
  }
  async safeParseAsync(e, t) {
    const s = {
      common: {
        issues: [],
        contextualErrorMap: t == null ? void 0 : t.errorMap,
        async: !0
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: $(e)
    }, a = this._parse({ data: e, path: s.path, parent: s }), n = await (Q(a) ? a : Promise.resolve(a));
    return ge(s, n);
  }
  refine(e, t) {
    const s = (a) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(a) : t;
    return this._refinement((a, n) => {
      const i = e(a), o = () => n.addIssue({
        code: d.custom,
        ...s(a)
      });
      return typeof Promise < "u" && i instanceof Promise ? i.then((l) => l ? !0 : (o(), !1)) : i ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((s, a) => e(s) ? !0 : (a.addIssue(typeof t == "function" ? t(s, a) : t), !1));
  }
  _refinement(e) {
    return new z({
      schema: this,
      typeName: m.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (t) => this["~validate"](t)
    };
  }
  optional() {
    return j.create(this, this._def);
  }
  nullable() {
    return U.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return A.create(this);
  }
  promise() {
    return se.create(this, this._def);
  }
  or(e) {
    return K.create([this, e], this._def);
  }
  and(e) {
    return ee.create(this, e, this._def);
  }
  transform(e) {
    return new z({
      ...y(this._def),
      schema: this,
      typeName: m.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ce({
      ...y(this._def),
      innerType: this,
      defaultValue: t,
      typeName: m.ZodDefault
    });
  }
  brand() {
    return new ut({
      typeName: m.ZodBranded,
      type: this,
      ...y(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ue({
      ...y(this._def),
      innerType: this,
      catchValue: t,
      typeName: m.ZodCatch
    });
  }
  describe(e) {
    const t = this.constructor;
    return new t({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return fe.create(this, e);
  }
  readonly() {
    return he.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Be = /^c[^\s-]{8,}$/i, Fe = /^[0-9a-z]+$/, qe = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Je = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, We = /^[a-z0-9_-]{21}$/i, He = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Ge = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Ye = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Qe = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let ae;
const Xe = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Ke = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, et = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, tt = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, st = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, rt = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, Ae = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", at = new RegExp(`^${Ae}$`);
function Oe(r) {
  let e = "[0-5]\\d";
  r.precision ? e = `${e}\\.\\d{${r.precision}}` : r.precision == null && (e = `${e}(\\.\\d+)?`);
  const t = r.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
function nt(r) {
  return new RegExp(`^${Oe(r)}$`);
}
function it(r) {
  let e = `${Ae}T${Oe(r)}`;
  const t = [];
  return t.push(r.local ? "Z?" : "Z"), r.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function ot(r, e) {
  return !!((e === "v4" || !e) && Xe.test(r) || (e === "v6" || !e) && et.test(r));
}
function dt(r, e) {
  if (!He.test(r))
    return !1;
  try {
    const [t] = r.split(".");
    if (!t)
      return !1;
    const s = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), a = JSON.parse(atob(s));
    return !(typeof a != "object" || a === null || "typ" in a && (a == null ? void 0 : a.typ) !== "JWT" || !a.alg || e && a.alg !== e);
  } catch {
    return !1;
  }
}
function lt(r, e) {
  return !!((e === "v4" || !e) && Ke.test(r) || (e === "v6" || !e) && tt.test(r));
}
class Z extends g {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== h.string) {
      const n = this._getOrReturnCtx(e);
      return u(n, {
        code: d.invalid_type,
        expected: h.string,
        received: n.parsedType
      }), _;
    }
    const s = new S();
    let a;
    for (const n of this._def.checks)
      if (n.kind === "min")
        e.data.length < n.value && (a = this._getOrReturnCtx(e, a), u(a, {
          code: d.too_small,
          minimum: n.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: n.message
        }), s.dirty());
      else if (n.kind === "max")
        e.data.length > n.value && (a = this._getOrReturnCtx(e, a), u(a, {
          code: d.too_big,
          maximum: n.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: n.message
        }), s.dirty());
      else if (n.kind === "length") {
        const i = e.data.length > n.value, o = e.data.length < n.value;
        (i || o) && (a = this._getOrReturnCtx(e, a), i ? u(a, {
          code: d.too_big,
          maximum: n.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: n.message
        }) : o && u(a, {
          code: d.too_small,
          minimum: n.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: n.message
        }), s.dirty());
      } else if (n.kind === "email")
        Ye.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
          validation: "email",
          code: d.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "emoji")
        ae || (ae = new RegExp(Qe, "u")), ae.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
          validation: "emoji",
          code: d.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "uuid")
        Je.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
          validation: "uuid",
          code: d.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "nanoid")
        We.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
          validation: "nanoid",
          code: d.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "cuid")
        Be.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
          validation: "cuid",
          code: d.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "cuid2")
        Fe.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
          validation: "cuid2",
          code: d.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "ulid")
        qe.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
          validation: "ulid",
          code: d.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "url")
        try {
          new URL(e.data);
        } catch {
          a = this._getOrReturnCtx(e, a), u(a, {
            validation: "url",
            code: d.invalid_string,
            message: n.message
          }), s.dirty();
        }
      else n.kind === "regex" ? (n.regex.lastIndex = 0, n.regex.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
        validation: "regex",
        code: d.invalid_string,
        message: n.message
      }), s.dirty())) : n.kind === "trim" ? e.data = e.data.trim() : n.kind === "includes" ? e.data.includes(n.value, n.position) || (a = this._getOrReturnCtx(e, a), u(a, {
        code: d.invalid_string,
        validation: { includes: n.value, position: n.position },
        message: n.message
      }), s.dirty()) : n.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : n.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : n.kind === "startsWith" ? e.data.startsWith(n.value) || (a = this._getOrReturnCtx(e, a), u(a, {
        code: d.invalid_string,
        validation: { startsWith: n.value },
        message: n.message
      }), s.dirty()) : n.kind === "endsWith" ? e.data.endsWith(n.value) || (a = this._getOrReturnCtx(e, a), u(a, {
        code: d.invalid_string,
        validation: { endsWith: n.value },
        message: n.message
      }), s.dirty()) : n.kind === "datetime" ? it(n).test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
        code: d.invalid_string,
        validation: "datetime",
        message: n.message
      }), s.dirty()) : n.kind === "date" ? at.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
        code: d.invalid_string,
        validation: "date",
        message: n.message
      }), s.dirty()) : n.kind === "time" ? nt(n).test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
        code: d.invalid_string,
        validation: "time",
        message: n.message
      }), s.dirty()) : n.kind === "duration" ? Ge.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
        validation: "duration",
        code: d.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "ip" ? ot(e.data, n.version) || (a = this._getOrReturnCtx(e, a), u(a, {
        validation: "ip",
        code: d.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "jwt" ? dt(e.data, n.alg) || (a = this._getOrReturnCtx(e, a), u(a, {
        validation: "jwt",
        code: d.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "cidr" ? lt(e.data, n.version) || (a = this._getOrReturnCtx(e, a), u(a, {
        validation: "cidr",
        code: d.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "base64" ? st.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
        validation: "base64",
        code: d.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "base64url" ? rt.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
        validation: "base64url",
        code: d.invalid_string,
        message: n.message
      }), s.dirty()) : v.assertNever(n);
    return { status: s.value, value: e.data };
  }
  _regex(e, t, s) {
    return this.refinement((a) => e.test(a), {
      validation: t,
      code: d.invalid_string,
      ...f.errToObj(s)
    });
  }
  _addCheck(e) {
    return new Z({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...f.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...f.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...f.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...f.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...f.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...f.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...f.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...f.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...f.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...f.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...f.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...f.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...f.errToObj(e) });
  }
  datetime(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      offset: (e == null ? void 0 : e.offset) ?? !1,
      local: (e == null ? void 0 : e.local) ?? !1,
      ...f.errToObj(e == null ? void 0 : e.message)
    });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: e
    }) : this._addCheck({
      kind: "time",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      ...f.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...f.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...f.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t == null ? void 0 : t.position,
      ...f.errToObj(t == null ? void 0 : t.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...f.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...f.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...f.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...f.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...f.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, f.errToObj(e));
  }
  trim() {
    return new Z({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new Z({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new Z({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((e) => e.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((e) => e.kind === "base64url");
  }
  get minLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
Z.create = (r) => new Z({
  checks: [],
  typeName: m.ZodString,
  coerce: (r == null ? void 0 : r.coerce) ?? !1,
  ...y(r)
});
function ct(r, e) {
  const t = (r.toString().split(".")[1] || "").length, s = (e.toString().split(".")[1] || "").length, a = t > s ? t : s, n = Number.parseInt(r.toFixed(a).replace(".", "")), i = Number.parseInt(e.toFixed(a).replace(".", ""));
  return n % i / 10 ** a;
}
class M extends g {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== h.number) {
      const n = this._getOrReturnCtx(e);
      return u(n, {
        code: d.invalid_type,
        expected: h.number,
        received: n.parsedType
      }), _;
    }
    let s;
    const a = new S();
    for (const n of this._def.checks)
      n.kind === "int" ? v.isInteger(e.data) || (s = this._getOrReturnCtx(e, s), u(s, {
        code: d.invalid_type,
        expected: "integer",
        received: "float",
        message: n.message
      }), a.dirty()) : n.kind === "min" ? (n.inclusive ? e.data < n.value : e.data <= n.value) && (s = this._getOrReturnCtx(e, s), u(s, {
        code: d.too_small,
        minimum: n.value,
        type: "number",
        inclusive: n.inclusive,
        exact: !1,
        message: n.message
      }), a.dirty()) : n.kind === "max" ? (n.inclusive ? e.data > n.value : e.data >= n.value) && (s = this._getOrReturnCtx(e, s), u(s, {
        code: d.too_big,
        maximum: n.value,
        type: "number",
        inclusive: n.inclusive,
        exact: !1,
        message: n.message
      }), a.dirty()) : n.kind === "multipleOf" ? ct(e.data, n.value) !== 0 && (s = this._getOrReturnCtx(e, s), u(s, {
        code: d.not_multiple_of,
        multipleOf: n.value,
        message: n.message
      }), a.dirty()) : n.kind === "finite" ? Number.isFinite(e.data) || (s = this._getOrReturnCtx(e, s), u(s, {
        code: d.not_finite,
        message: n.message
      }), a.dirty()) : v.assertNever(n);
    return { status: a.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, f.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, f.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, f.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, f.toString(t));
  }
  setLimit(e, t, s, a) {
    return new M({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: f.toString(a)
        }
      ]
    });
  }
  _addCheck(e) {
    return new M({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: f.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: f.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: f.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: f.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: f.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: f.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: f.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: f.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: f.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && v.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const s of this._def.checks) {
      if (s.kind === "finite" || s.kind === "int" || s.kind === "multipleOf")
        return !0;
      s.kind === "min" ? (t === null || s.value > t) && (t = s.value) : s.kind === "max" && (e === null || s.value < e) && (e = s.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
M.create = (r) => new M({
  checks: [],
  typeName: m.ZodNumber,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...y(r)
});
class H extends g {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce)
      try {
        e.data = BigInt(e.data);
      } catch {
        return this._getInvalidInput(e);
      }
    if (this._getType(e) !== h.bigint)
      return this._getInvalidInput(e);
    let s;
    const a = new S();
    for (const n of this._def.checks)
      n.kind === "min" ? (n.inclusive ? e.data < n.value : e.data <= n.value) && (s = this._getOrReturnCtx(e, s), u(s, {
        code: d.too_small,
        type: "bigint",
        minimum: n.value,
        inclusive: n.inclusive,
        message: n.message
      }), a.dirty()) : n.kind === "max" ? (n.inclusive ? e.data > n.value : e.data >= n.value) && (s = this._getOrReturnCtx(e, s), u(s, {
        code: d.too_big,
        type: "bigint",
        maximum: n.value,
        inclusive: n.inclusive,
        message: n.message
      }), a.dirty()) : n.kind === "multipleOf" ? e.data % n.value !== BigInt(0) && (s = this._getOrReturnCtx(e, s), u(s, {
        code: d.not_multiple_of,
        multipleOf: n.value,
        message: n.message
      }), a.dirty()) : v.assertNever(n);
    return { status: a.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return u(t, {
      code: d.invalid_type,
      expected: h.bigint,
      received: t.parsedType
    }), _;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, f.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, f.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, f.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, f.toString(t));
  }
  setLimit(e, t, s, a) {
    return new H({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: f.toString(a)
        }
      ]
    });
  }
  _addCheck(e) {
    return new H({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: f.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: f.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: f.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: f.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: f.toString(t)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
H.create = (r) => new H({
  checks: [],
  typeName: m.ZodBigInt,
  coerce: (r == null ? void 0 : r.coerce) ?? !1,
  ...y(r)
});
class ie extends g {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== h.boolean) {
      const s = this._getOrReturnCtx(e);
      return u(s, {
        code: d.invalid_type,
        expected: h.boolean,
        received: s.parsedType
      }), _;
    }
    return R(e.data);
  }
}
ie.create = (r) => new ie({
  typeName: m.ZodBoolean,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...y(r)
});
class X extends g {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== h.date) {
      const n = this._getOrReturnCtx(e);
      return u(n, {
        code: d.invalid_type,
        expected: h.date,
        received: n.parsedType
      }), _;
    }
    if (Number.isNaN(e.data.getTime())) {
      const n = this._getOrReturnCtx(e);
      return u(n, {
        code: d.invalid_date
      }), _;
    }
    const s = new S();
    let a;
    for (const n of this._def.checks)
      n.kind === "min" ? e.data.getTime() < n.value && (a = this._getOrReturnCtx(e, a), u(a, {
        code: d.too_small,
        message: n.message,
        inclusive: !0,
        exact: !1,
        minimum: n.value,
        type: "date"
      }), s.dirty()) : n.kind === "max" ? e.data.getTime() > n.value && (a = this._getOrReturnCtx(e, a), u(a, {
        code: d.too_big,
        message: n.message,
        inclusive: !0,
        exact: !1,
        maximum: n.value,
        type: "date"
      }), s.dirty()) : v.assertNever(n);
    return {
      status: s.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new X({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: f.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: f.toString(t)
    });
  }
  get minDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
}
X.create = (r) => new X({
  checks: [],
  coerce: (r == null ? void 0 : r.coerce) || !1,
  typeName: m.ZodDate,
  ...y(r)
});
class ve extends g {
  _parse(e) {
    if (this._getType(e) !== h.symbol) {
      const s = this._getOrReturnCtx(e);
      return u(s, {
        code: d.invalid_type,
        expected: h.symbol,
        received: s.parsedType
      }), _;
    }
    return R(e.data);
  }
}
ve.create = (r) => new ve({
  typeName: m.ZodSymbol,
  ...y(r)
});
class xe extends g {
  _parse(e) {
    if (this._getType(e) !== h.undefined) {
      const s = this._getOrReturnCtx(e);
      return u(s, {
        code: d.invalid_type,
        expected: h.undefined,
        received: s.parsedType
      }), _;
    }
    return R(e.data);
  }
}
xe.create = (r) => new xe({
  typeName: m.ZodUndefined,
  ...y(r)
});
class be extends g {
  _parse(e) {
    if (this._getType(e) !== h.null) {
      const s = this._getOrReturnCtx(e);
      return u(s, {
        code: d.invalid_type,
        expected: h.null,
        received: s.parsedType
      }), _;
    }
    return R(e.data);
  }
}
be.create = (r) => new be({
  typeName: m.ZodNull,
  ...y(r)
});
class ke extends g {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return R(e.data);
  }
}
ke.create = (r) => new ke({
  typeName: m.ZodAny,
  ...y(r)
});
class we extends g {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return R(e.data);
  }
}
we.create = (r) => new we({
  typeName: m.ZodUnknown,
  ...y(r)
});
class I extends g {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return u(t, {
      code: d.invalid_type,
      expected: h.never,
      received: t.parsedType
    }), _;
  }
}
I.create = (r) => new I({
  typeName: m.ZodNever,
  ...y(r)
});
class Se extends g {
  _parse(e) {
    if (this._getType(e) !== h.undefined) {
      const s = this._getOrReturnCtx(e);
      return u(s, {
        code: d.invalid_type,
        expected: h.void,
        received: s.parsedType
      }), _;
    }
    return R(e.data);
  }
}
Se.create = (r) => new Se({
  typeName: m.ZodVoid,
  ...y(r)
});
class A extends g {
  _parse(e) {
    const { ctx: t, status: s } = this._processInputParams(e), a = this._def;
    if (t.parsedType !== h.array)
      return u(t, {
        code: d.invalid_type,
        expected: h.array,
        received: t.parsedType
      }), _;
    if (a.exactLength !== null) {
      const i = t.data.length > a.exactLength.value, o = t.data.length < a.exactLength.value;
      (i || o) && (u(t, {
        code: i ? d.too_big : d.too_small,
        minimum: o ? a.exactLength.value : void 0,
        maximum: i ? a.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: a.exactLength.message
      }), s.dirty());
    }
    if (a.minLength !== null && t.data.length < a.minLength.value && (u(t, {
      code: d.too_small,
      minimum: a.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: a.minLength.message
    }), s.dirty()), a.maxLength !== null && t.data.length > a.maxLength.value && (u(t, {
      code: d.too_big,
      maximum: a.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: a.maxLength.message
    }), s.dirty()), t.common.async)
      return Promise.all([...t.data].map((i, o) => a.type._parseAsync(new O(t, i, t.path, o)))).then((i) => S.mergeArray(s, i));
    const n = [...t.data].map((i, o) => a.type._parseSync(new O(t, i, t.path, o)));
    return S.mergeArray(s, n);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new A({
      ...this._def,
      minLength: { value: e, message: f.toString(t) }
    });
  }
  max(e, t) {
    return new A({
      ...this._def,
      maxLength: { value: e, message: f.toString(t) }
    });
  }
  length(e, t) {
    return new A({
      ...this._def,
      exactLength: { value: e, message: f.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
A.create = (r, e) => new A({
  type: r,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: m.ZodArray,
  ...y(e)
});
function L(r) {
  if (r instanceof x) {
    const e = {};
    for (const t in r.shape) {
      const s = r.shape[t];
      e[t] = j.create(L(s));
    }
    return new x({
      ...r._def,
      shape: () => e
    });
  } else return r instanceof A ? new A({
    ...r._def,
    type: L(r.element)
  }) : r instanceof j ? j.create(L(r.unwrap())) : r instanceof U ? U.create(L(r.unwrap())) : r instanceof V ? V.create(r.items.map((e) => L(e))) : r;
}
class x extends g {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = v.objectKeys(e);
    return this._cached = { shape: e, keys: t }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== h.object) {
      const c = this._getOrReturnCtx(e);
      return u(c, {
        code: d.invalid_type,
        expected: h.object,
        received: c.parsedType
      }), _;
    }
    const { status: s, ctx: a } = this._processInputParams(e), { shape: n, keys: i } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof I && this._def.unknownKeys === "strip"))
      for (const c in a.data)
        i.includes(c) || o.push(c);
    const l = [];
    for (const c of i) {
      const p = n[c], b = a.data[c];
      l.push({
        key: { status: "valid", value: c },
        value: p._parse(new O(a, b, a.path, c)),
        alwaysSet: c in a.data
      });
    }
    if (this._def.catchall instanceof I) {
      const c = this._def.unknownKeys;
      if (c === "passthrough")
        for (const p of o)
          l.push({
            key: { status: "valid", value: p },
            value: { status: "valid", value: a.data[p] }
          });
      else if (c === "strict")
        o.length > 0 && (u(a, {
          code: d.unrecognized_keys,
          keys: o
        }), s.dirty());
      else if (c !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const c = this._def.catchall;
      for (const p of o) {
        const b = a.data[p];
        l.push({
          key: { status: "valid", value: p },
          value: c._parse(
            new O(a, b, a.path, p)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: p in a.data
        });
      }
    }
    return a.common.async ? Promise.resolve().then(async () => {
      const c = [];
      for (const p of l) {
        const b = await p.key, T = await p.value;
        c.push({
          key: b,
          value: T,
          alwaysSet: p.alwaysSet
        });
      }
      return c;
    }).then((c) => S.mergeObjectSync(s, c)) : S.mergeObjectSync(s, l);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return f.errToObj, new x({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, s) => {
          var n, i;
          const a = ((i = (n = this._def).errorMap) == null ? void 0 : i.call(n, t, s).message) ?? s.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: f.errToObj(e).message ?? a
          } : {
            message: a
          };
        }
      } : {}
    });
  }
  strip() {
    return new x({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new x({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new x({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new x({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: m.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new x({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    for (const s of v.objectKeys(e))
      e[s] && this.shape[s] && (t[s] = this.shape[s]);
    return new x({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    for (const s of v.objectKeys(this.shape))
      e[s] || (t[s] = this.shape[s]);
    return new x({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return L(this);
  }
  partial(e) {
    const t = {};
    for (const s of v.objectKeys(this.shape)) {
      const a = this.shape[s];
      e && !e[s] ? t[s] = a : t[s] = a.optional();
    }
    return new x({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    for (const s of v.objectKeys(this.shape))
      if (e && !e[s])
        t[s] = this.shape[s];
      else {
        let n = this.shape[s];
        for (; n instanceof j; )
          n = n._def.innerType;
        t[s] = n;
      }
    return new x({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return Ne(v.objectKeys(this.shape));
  }
}
x.create = (r, e) => new x({
  shape: () => r,
  unknownKeys: "strip",
  catchall: I.create(),
  typeName: m.ZodObject,
  ...y(e)
});
x.strictCreate = (r, e) => new x({
  shape: () => r,
  unknownKeys: "strict",
  catchall: I.create(),
  typeName: m.ZodObject,
  ...y(e)
});
x.lazycreate = (r, e) => new x({
  shape: r,
  unknownKeys: "strip",
  catchall: I.create(),
  typeName: m.ZodObject,
  ...y(e)
});
class K extends g {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = this._def.options;
    function a(n) {
      for (const o of n)
        if (o.result.status === "valid")
          return o.result;
      for (const o of n)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const i = n.map((o) => new E(o.ctx.common.issues));
      return u(t, {
        code: d.invalid_union,
        unionErrors: i
      }), _;
    }
    if (t.common.async)
      return Promise.all(s.map(async (n) => {
        const i = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await n._parseAsync({
            data: t.data,
            path: t.path,
            parent: i
          }),
          ctx: i
        };
      })).then(a);
    {
      let n;
      const i = [];
      for (const l of s) {
        const c = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, p = l._parseSync({
          data: t.data,
          path: t.path,
          parent: c
        });
        if (p.status === "valid")
          return p;
        p.status === "dirty" && !n && (n = { result: p, ctx: c }), c.common.issues.length && i.push(c.common.issues);
      }
      if (n)
        return t.common.issues.push(...n.ctx.common.issues), n.result;
      const o = i.map((l) => new E(l));
      return u(t, {
        code: d.invalid_union,
        unionErrors: o
      }), _;
    }
  }
  get options() {
    return this._def.options;
  }
}
K.create = (r, e) => new K({
  options: r,
  typeName: m.ZodUnion,
  ...y(e)
});
function oe(r, e) {
  const t = $(r), s = $(e);
  if (r === e)
    return { valid: !0, data: r };
  if (t === h.object && s === h.object) {
    const a = v.objectKeys(e), n = v.objectKeys(r).filter((o) => a.indexOf(o) !== -1), i = { ...r, ...e };
    for (const o of n) {
      const l = oe(r[o], e[o]);
      if (!l.valid)
        return { valid: !1 };
      i[o] = l.data;
    }
    return { valid: !0, data: i };
  } else if (t === h.array && s === h.array) {
    if (r.length !== e.length)
      return { valid: !1 };
    const a = [];
    for (let n = 0; n < r.length; n++) {
      const i = r[n], o = e[n], l = oe(i, o);
      if (!l.valid)
        return { valid: !1 };
      a.push(l.data);
    }
    return { valid: !0, data: a };
  } else return t === h.date && s === h.date && +r == +e ? { valid: !0, data: r } : { valid: !1 };
}
class ee extends g {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), a = (n, i) => {
      if (_e(n) || _e(i))
        return _;
      const o = oe(n.value, i.value);
      return o.valid ? ((ye(n) || ye(i)) && t.dirty(), { status: t.value, value: o.data }) : (u(s, {
        code: d.invalid_intersection_types
      }), _);
    };
    return s.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: s.data,
        path: s.path,
        parent: s
      }),
      this._def.right._parseAsync({
        data: s.data,
        path: s.path,
        parent: s
      })
    ]).then(([n, i]) => a(n, i)) : a(this._def.left._parseSync({
      data: s.data,
      path: s.path,
      parent: s
    }), this._def.right._parseSync({
      data: s.data,
      path: s.path,
      parent: s
    }));
  }
}
ee.create = (r, e, t) => new ee({
  left: r,
  right: e,
  typeName: m.ZodIntersection,
  ...y(t)
});
class V extends g {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== h.array)
      return u(s, {
        code: d.invalid_type,
        expected: h.array,
        received: s.parsedType
      }), _;
    if (s.data.length < this._def.items.length)
      return u(s, {
        code: d.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), _;
    !this._def.rest && s.data.length > this._def.items.length && (u(s, {
      code: d.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const n = [...s.data].map((i, o) => {
      const l = this._def.items[o] || this._def.rest;
      return l ? l._parse(new O(s, i, s.path, o)) : null;
    }).filter((i) => !!i);
    return s.common.async ? Promise.all(n).then((i) => S.mergeArray(t, i)) : S.mergeArray(t, n);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new V({
      ...this._def,
      rest: e
    });
  }
}
V.create = (r, e) => {
  if (!Array.isArray(r))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new V({
    items: r,
    typeName: m.ZodTuple,
    rest: null,
    ...y(e)
  });
};
class te extends g {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== h.object)
      return u(s, {
        code: d.invalid_type,
        expected: h.object,
        received: s.parsedType
      }), _;
    const a = [], n = this._def.keyType, i = this._def.valueType;
    for (const o in s.data)
      a.push({
        key: n._parse(new O(s, o, s.path, o)),
        value: i._parse(new O(s, s.data[o], s.path, o)),
        alwaysSet: o in s.data
      });
    return s.common.async ? S.mergeObjectAsync(t, a) : S.mergeObjectSync(t, a);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, s) {
    return t instanceof g ? new te({
      keyType: e,
      valueType: t,
      typeName: m.ZodRecord,
      ...y(s)
    }) : new te({
      keyType: Z.create(),
      valueType: e,
      typeName: m.ZodRecord,
      ...y(t)
    });
  }
}
class Ce extends g {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== h.map)
      return u(s, {
        code: d.invalid_type,
        expected: h.map,
        received: s.parsedType
      }), _;
    const a = this._def.keyType, n = this._def.valueType, i = [...s.data.entries()].map(([o, l], c) => ({
      key: a._parse(new O(s, o, s.path, [c, "key"])),
      value: n._parse(new O(s, l, s.path, [c, "value"]))
    }));
    if (s.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const l of i) {
          const c = await l.key, p = await l.value;
          if (c.status === "aborted" || p.status === "aborted")
            return _;
          (c.status === "dirty" || p.status === "dirty") && t.dirty(), o.set(c.value, p.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const l of i) {
        const c = l.key, p = l.value;
        if (c.status === "aborted" || p.status === "aborted")
          return _;
        (c.status === "dirty" || p.status === "dirty") && t.dirty(), o.set(c.value, p.value);
      }
      return { status: t.value, value: o };
    }
  }
}
Ce.create = (r, e, t) => new Ce({
  valueType: e,
  keyType: r,
  typeName: m.ZodMap,
  ...y(t)
});
class G extends g {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== h.set)
      return u(s, {
        code: d.invalid_type,
        expected: h.set,
        received: s.parsedType
      }), _;
    const a = this._def;
    a.minSize !== null && s.data.size < a.minSize.value && (u(s, {
      code: d.too_small,
      minimum: a.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: a.minSize.message
    }), t.dirty()), a.maxSize !== null && s.data.size > a.maxSize.value && (u(s, {
      code: d.too_big,
      maximum: a.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: a.maxSize.message
    }), t.dirty());
    const n = this._def.valueType;
    function i(l) {
      const c = /* @__PURE__ */ new Set();
      for (const p of l) {
        if (p.status === "aborted")
          return _;
        p.status === "dirty" && t.dirty(), c.add(p.value);
      }
      return { status: t.value, value: c };
    }
    const o = [...s.data.values()].map((l, c) => n._parse(new O(s, l, s.path, c)));
    return s.common.async ? Promise.all(o).then((l) => i(l)) : i(o);
  }
  min(e, t) {
    return new G({
      ...this._def,
      minSize: { value: e, message: f.toString(t) }
    });
  }
  max(e, t) {
    return new G({
      ...this._def,
      maxSize: { value: e, message: f.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
G.create = (r, e) => new G({
  valueType: r,
  minSize: null,
  maxSize: null,
  typeName: m.ZodSet,
  ...y(e)
});
class de extends g {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
de.create = (r, e) => new de({
  getter: r,
  typeName: m.ZodLazy,
  ...y(e)
});
class le extends g {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return u(t, {
        received: t.data,
        code: d.invalid_literal,
        expected: this._def.value
      }), _;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
le.create = (r, e) => new le({
  value: r,
  typeName: m.ZodLiteral,
  ...y(e)
});
function Ne(r, e) {
  return new P({
    values: r,
    typeName: m.ZodEnum,
    ...y(e)
  });
}
class P extends g {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return u(t, {
        expected: v.joinValues(s),
        received: t.parsedType,
        code: d.invalid_type
      }), _;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return u(t, {
        received: t.data,
        code: d.invalid_enum_value,
        options: s
      }), _;
    }
    return R(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Values() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  extract(e, t = this._def) {
    return P.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return P.create(this.options.filter((s) => !e.includes(s)), {
      ...this._def,
      ...t
    });
  }
}
P.create = Ne;
class Re extends g {
  _parse(e) {
    const t = v.getValidEnumValues(this._def.values), s = this._getOrReturnCtx(e);
    if (s.parsedType !== h.string && s.parsedType !== h.number) {
      const a = v.objectValues(t);
      return u(s, {
        expected: v.joinValues(a),
        received: s.parsedType,
        code: d.invalid_type
      }), _;
    }
    if (this._cache || (this._cache = new Set(v.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const a = v.objectValues(t);
      return u(s, {
        received: s.data,
        code: d.invalid_enum_value,
        options: a
      }), _;
    }
    return R(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
Re.create = (r, e) => new Re({
  values: r,
  typeName: m.ZodNativeEnum,
  ...y(e)
});
class se extends g {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== h.promise && t.common.async === !1)
      return u(t, {
        code: d.invalid_type,
        expected: h.promise,
        received: t.parsedType
      }), _;
    const s = t.parsedType === h.promise ? t.data : Promise.resolve(t.data);
    return R(s.then((a) => this._def.type.parseAsync(a, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
se.create = (r, e) => new se({
  type: r,
  typeName: m.ZodPromise,
  ...y(e)
});
class z extends g {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === m.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), a = this._def.effect || null, n = {
      addIssue: (i) => {
        u(s, i), i.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return s.path;
      }
    };
    if (n.addIssue = n.addIssue.bind(n), a.type === "preprocess") {
      const i = a.transform(s.data, n);
      if (s.common.async)
        return Promise.resolve(i).then(async (o) => {
          if (t.value === "aborted")
            return _;
          const l = await this._def.schema._parseAsync({
            data: o,
            path: s.path,
            parent: s
          });
          return l.status === "aborted" ? _ : l.status === "dirty" || t.value === "dirty" ? W(l.value) : l;
        });
      {
        if (t.value === "aborted")
          return _;
        const o = this._def.schema._parseSync({
          data: i,
          path: s.path,
          parent: s
        });
        return o.status === "aborted" ? _ : o.status === "dirty" || t.value === "dirty" ? W(o.value) : o;
      }
    }
    if (a.type === "refinement") {
      const i = (o) => {
        const l = a.refinement(o, n);
        if (s.common.async)
          return Promise.resolve(l);
        if (l instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (s.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return o.status === "aborted" ? _ : (o.status === "dirty" && t.dirty(), i(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((o) => o.status === "aborted" ? _ : (o.status === "dirty" && t.dirty(), i(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (a.type === "transform")
      if (s.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        if (!D(i))
          return _;
        const o = a.transform(i.value, n);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((i) => D(i) ? Promise.resolve(a.transform(i.value, n)).then((o) => ({
          status: t.value,
          value: o
        })) : _);
    v.assertNever(a);
  }
}
z.create = (r, e, t) => new z({
  schema: r,
  typeName: m.ZodEffects,
  effect: e,
  ...y(t)
});
z.createWithPreprocess = (r, e, t) => new z({
  schema: e,
  effect: { type: "preprocess", transform: r },
  typeName: m.ZodEffects,
  ...y(t)
});
class j extends g {
  _parse(e) {
    return this._getType(e) === h.undefined ? R(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
j.create = (r, e) => new j({
  innerType: r,
  typeName: m.ZodOptional,
  ...y(e)
});
class U extends g {
  _parse(e) {
    return this._getType(e) === h.null ? R(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
U.create = (r, e) => new U({
  innerType: r,
  typeName: m.ZodNullable,
  ...y(e)
});
class ce extends g {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let s = t.data;
    return t.parsedType === h.undefined && (s = this._def.defaultValue()), this._def.innerType._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ce.create = (r, e) => new ce({
  innerType: r,
  typeName: m.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...y(e)
});
class ue extends g {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, a = this._def.innerType._parse({
      data: s.data,
      path: s.path,
      parent: {
        ...s
      }
    });
    return Q(a) ? a.then((n) => ({
      status: "valid",
      value: n.status === "valid" ? n.value : this._def.catchValue({
        get error() {
          return new E(s.common.issues);
        },
        input: s.data
      })
    })) : {
      status: "valid",
      value: a.status === "valid" ? a.value : this._def.catchValue({
        get error() {
          return new E(s.common.issues);
        },
        input: s.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ue.create = (r, e) => new ue({
  innerType: r,
  typeName: m.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...y(e)
});
class Te extends g {
  _parse(e) {
    if (this._getType(e) !== h.nan) {
      const s = this._getOrReturnCtx(e);
      return u(s, {
        code: d.invalid_type,
        expected: h.nan,
        received: s.parsedType
      }), _;
    }
    return { status: "valid", value: e.data };
  }
}
Te.create = (r) => new Te({
  typeName: m.ZodNaN,
  ...y(r)
});
class ut extends g {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = t.data;
    return this._def.type._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class fe extends g {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.common.async)
      return (async () => {
        const n = await this._def.in._parseAsync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return n.status === "aborted" ? _ : n.status === "dirty" ? (t.dirty(), W(n.value)) : this._def.out._parseAsync({
          data: n.value,
          path: s.path,
          parent: s
        });
      })();
    {
      const a = this._def.in._parseSync({
        data: s.data,
        path: s.path,
        parent: s
      });
      return a.status === "aborted" ? _ : a.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: a.value
      }) : this._def.out._parseSync({
        data: a.value,
        path: s.path,
        parent: s
      });
    }
  }
  static create(e, t) {
    return new fe({
      in: e,
      out: t,
      typeName: m.ZodPipeline
    });
  }
}
class he extends g {
  _parse(e) {
    const t = this._def.innerType._parse(e), s = (a) => (D(a) && (a.value = Object.freeze(a.value)), a);
    return Q(t) ? t.then((a) => s(a)) : s(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
he.create = (r, e) => new he({
  innerType: r,
  typeName: m.ZodReadonly,
  ...y(e)
});
var m;
(function(r) {
  r.ZodString = "ZodString", r.ZodNumber = "ZodNumber", r.ZodNaN = "ZodNaN", r.ZodBigInt = "ZodBigInt", r.ZodBoolean = "ZodBoolean", r.ZodDate = "ZodDate", r.ZodSymbol = "ZodSymbol", r.ZodUndefined = "ZodUndefined", r.ZodNull = "ZodNull", r.ZodAny = "ZodAny", r.ZodUnknown = "ZodUnknown", r.ZodNever = "ZodNever", r.ZodVoid = "ZodVoid", r.ZodArray = "ZodArray", r.ZodObject = "ZodObject", r.ZodUnion = "ZodUnion", r.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r.ZodIntersection = "ZodIntersection", r.ZodTuple = "ZodTuple", r.ZodRecord = "ZodRecord", r.ZodMap = "ZodMap", r.ZodSet = "ZodSet", r.ZodFunction = "ZodFunction", r.ZodLazy = "ZodLazy", r.ZodLiteral = "ZodLiteral", r.ZodEnum = "ZodEnum", r.ZodEffects = "ZodEffects", r.ZodNativeEnum = "ZodNativeEnum", r.ZodOptional = "ZodOptional", r.ZodNullable = "ZodNullable", r.ZodDefault = "ZodDefault", r.ZodCatch = "ZodCatch", r.ZodPromise = "ZodPromise", r.ZodBranded = "ZodBranded", r.ZodPipeline = "ZodPipeline", r.ZodReadonly = "ZodReadonly";
})(m || (m = {}));
const k = Z.create, N = M.create, w = ie.create;
I.create;
const re = A.create, C = x.create, B = K.create, F = ee.create;
V.create;
const me = te.create, Ze = de.create, q = le.create;
P.create;
se.create;
j.create;
U.create;
var ht = /^\w+([_]\w+)*$/, Ee = /^\w+([\s-_]\w+)*$/, $e = me(Ze(function() {
  return B([k(), N(), w(), $e]);
})), J = C({
  title: k().regex(Ee).max(40).optional(),
  required: w().optional(),
  description: k().optional(),
  defaultValue: B([k(), w(), N(), $e]).optional(),
  format: k().optional(),
  isValueField: w().optional()
}), ft = N().int().positive().lte(12).gte(1), je = F(J, C({
  type: q("string"),
  minLength: N().optional(),
  maxLength: N().optional()
})), Ie = F(J, C({
  type: q("string"),
  enum: re(k().nonempty()),
  showAsRadio: w().optional(),
  verticalLayout: w().optional()
})), Ve = F(J, C({
  type: q("number"),
  minimum: N().optional(),
  maximum: N().optional()
})), Le = F(J, C({
  type: q("integer"),
  minimum: N().optional(),
  maximum: N().optional()
})), De = F(J, C({
  type: q("boolean")
})), Me = F(J, C({
  type: q("object"),
  properties: Ze(function() {
    return me(B([
      Ie,
      je,
      Ve,
      Le,
      De,
      Me
    ]));
  }).optional()
})), mt = B([
  Ie,
  je,
  Ve,
  Le,
  De,
  Me
]), pt = C({
  staticProperties: re(k()).optional(),
  canvasRestrictions: C({
    hideInToolbar: w().optional(),
    minSize: ft.optional(),
    isFullRow: w().optional()
  }).optional()
}), _t = C({
  version: k().nonempty(),
  fallbackDisableSubmit: w(),
  controlName: k().nonempty().regex(Ee).max(40),
  pluginAuthor: k().optional(),
  pluginVersion: k().optional(),
  searchTerms: re(k()).optional(),
  description: k().optional(),
  groupName: B([
    k(),
    C({
      name: k(),
      order: N()
    })
  ]).optional(),
  iconUrl: k().optional(),
  designer: pt.optional(),
  properties: me(k().regex(ht), B([mt, w()])).optional(),
  standardProperties: C({
    fieldLabel: w().optional(),
    toolTip: w().optional(),
    description: w().optional(),
    placeholder: w().optional(),
    defaultValue: w().optional(),
    visibility: w().optional(),
    readOnly: w().optional(),
    required: w().optional()
  }).optional(),
  events: re(k()).optional()
}).strict();
class yt extends HTMLElement {
  static async getMetaConfig() {
    const e = {
      version: "1",
      controlName: "Central Table Grid",
      fallbackDisableSubmit: !1,
      description: "Editable table grid with add/delete rows and sortable columns.",
      groupName: "Central Custom Controls",
      properties: {
        value: {
          type: "object",
          title: "Grid value",
          isValueField: !0,
          defaultValue: { rows: [] }
        },
        columnsJson: {
          type: "string",
          title: "Columns (JSON)",
          defaultValue: '[{"field":"col1","label":"Column 1","type":"text","editable":true}]',
          description: 'JSON array like: [{"field":"item","label":"Item","type":"text","editable":true},{"field":"qty","label":"Qty","type":"number","editable":true}]'
        },
        allowAdd: { type: "boolean", title: "Allow add rows", defaultValue: !0 },
        allowDelete: { type: "boolean", title: "Allow delete rows", defaultValue: !0 },
        allowSort: { type: "boolean", title: "Allow sorting", defaultValue: !0 },
        minRows: { type: "integer", title: "Minimum rows", defaultValue: 0 },
        maxRows: { type: "integer", title: "Maximum rows (0 = unlimited)", defaultValue: 0 },
        readOnly: { type: "boolean", title: "Read only", defaultValue: !1 }
      }
    };
    return _t.parse(e), e;
  }
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this._config = {
      columns: [],
      allowAdd: !0,
      allowDelete: !0,
      allowSort: !0,
      minRows: 0,
      maxRows: 0,
      readOnly: !1
    }, this._value = { rows: [] }, this._columnsJson = "", this._sort = { field: null, dir: "asc" }, this._onAddRow = this._onAddRow.bind(this);
  }
  connectedCallback() {
    const e = this.getAttribute("columnsjson") || this.getAttribute("columnsJson");
    e && !this._columnsJson && (this.columnsJson = e), this._ensureMinRows(), this._ensureRowShape(), this._render();
  }
  // ---- Nintex-set properties ----
  set value(e) {
    this._value = { rows: Array.isArray(e == null ? void 0 : e.rows) ? e.rows : [] }, this._ensureMinRows(), this._ensureRowShape(), this._render();
  }
  get value() {
    return this._value;
  }
  set columnsJson(e) {
    this._columnsJson = typeof e == "string" ? e : "", this._applyColumnsFromColumnsJson(this._columnsJson), this._ensureRowShape(), this._render();
  }
  get columnsJson() {
    return this._columnsJson;
  }
  set allowAdd(e) {
    this._config.allowAdd = !!e, this._render();
  }
  set allowDelete(e) {
    this._config.allowDelete = !!e, this._render();
  }
  set allowSort(e) {
    this._config.allowSort = !!e, this._render();
  }
  set minRows(e) {
    this._config.minRows = Math.max(0, Number(e) || 0), this._ensureMinRows(), this._render();
  }
  set maxRows(e) {
    this._config.maxRows = Math.max(0, Number(e) || 0), this._render();
  }
  set readOnly(e) {
    this._config.readOnly = !!e, this._render();
  }
  // ---- Helpers ----
  _emitValueChange() {
    this.dispatchEvent(new CustomEvent("ntx-value-change", {
      bubbles: !0,
      composed: !0,
      detail: this.value
    }));
  }
  _applyColumnsFromColumnsJson(e) {
    if (!e) {
      this._config.columns = [];
      return;
    }
    try {
      const t = JSON.parse(e);
      if (!Array.isArray(t)) return;
      this._config.columns = t.filter((s) => s && typeof s.field == "string" && s.field.trim().length > 0).map((s) => ({
        field: String(s.field),
        label: s.label != null ? String(s.label) : String(s.field),
        type: s.type === "number" || s.type === "boolean" || s.type === "checkbox" ? s.type : "text",
        editable: !!s.editable
      }));
    } catch {
    }
  }
  _maxRowsLimit() {
    return this._config.maxRows > 0 ? this._config.maxRows : null;
  }
  _defaultCellValue(e) {
    return e === "number" ? 0 : e === "boolean" || e === "checkbox" ? !1 : "";
  }
  _getDefaultRow() {
    const e = {};
    for (const t of this._config.columns) e[t.field] = this._defaultCellValue(t.type);
    return e;
  }
  _ensureMinRows() {
    for (; this._value.rows.length < (this._config.minRows || 0); )
      this._value.rows.push(this._getDefaultRow());
  }
  _ensureRowShape() {
    const e = this._config.columns || [];
    this._value.rows = (this._value.rows || []).map((t) => {
      const s = { ...t || {} };
      for (const a of e)
        a.field in s || (s[a.field] = this._defaultCellValue(a.type));
      return s;
    });
  }
  _canAdd() {
    if (this._config.readOnly || !this._config.allowAdd) return !1;
    const e = this._maxRowsLimit();
    return e == null ? !0 : this._value.rows.length < e;
  }
  _canDelete() {
    return this._config.readOnly || !this._config.allowDelete ? !1 : this._value.rows.length > (this._config.minRows || 0);
  }
  _sortRows(e) {
    if (!this._config.allowSort || !this._sort.field) return e;
    const { field: t, dir: s } = this._sort, a = this._config.columns.find((o) => o.field === t), n = (a == null ? void 0 : a.type) || "text", i = [...e].sort((o, l) => {
      const c = o == null ? void 0 : o[t], p = l == null ? void 0 : l[t];
      return n === "number" ? Number(c ?? 0) - Number(p ?? 0) : String(c ?? "").toLowerCase().localeCompare(String(p ?? "").toLowerCase());
    });
    return s === "desc" ? i.reverse() : i;
  }
  _toggleSort(e) {
    this._config.allowSort && (this._sort.field !== e ? this._sort = { field: e, dir: "asc" } : this._sort.dir = this._sort.dir === "asc" ? "desc" : "asc", this._render());
  }
  _onAddRow() {
    this._canAdd() && (this._value.rows = [...this._value.rows, this._getDefaultRow()], this._emitValueChange(), this._render());
  }
  _onDeleteRow(e) {
    if (!this._canDelete()) return;
    const s = this._sortRows(this._value.rows)[e], a = this._value.rows.indexOf(s);
    if (a < 0) return;
    const n = [...this._value.rows];
    n.splice(a, 1), this._value.rows = n, this._emitValueChange(), this._render();
  }
  _onEditCell(e, t, s) {
    if (this._config.readOnly) return;
    const n = this._sortRows(this._value.rows)[e], i = this._value.rows.indexOf(n);
    if (i < 0) return;
    const o = this._config.columns.find((b) => b.field === t), l = (o == null ? void 0 : o.type) || "text", c = [...this._value.rows], p = { ...c[i] || {} };
    l === "number" ? p[t] = Number.isFinite(Number(s)) ? Number(s) : null : l === "boolean" || l === "checkbox" ? p[t] = !!s : p[t] = s ?? "", c[i] = p, this._value.rows = c, this._emitValueChange();
  }
  _render() {
    const e = this._config.columns || [], t = this._sortRows(this._value.rows || []), s = `
      :host { display:block; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
      .wrap { border:1px solid #ddd; border-radius:8px; overflow:hidden; }
      .toolbar { display:flex; gap:8px; align-items:center; padding:10px; border-bottom:1px solid #eee; background:#fafafa; }
      button { padding:6px 10px; border:1px solid #ccc; background:white; border-radius:6px; cursor:pointer; }
      button:disabled { opacity:0.5; cursor:not-allowed; }
      table { width:100%; border-collapse:collapse; }
      th, td { padding:8px 10px; border-bottom:1px solid #eee; vertical-align:top; }
      th { text-align:left; font-weight:600; background:#fcfcfc; user-select:none; }
      th.sortable { cursor:pointer; }
      th .sort { font-size:12px; margin-left:6px; opacity:0.7; }
      input[type="text"], input[type="number"] { width:100%; box-sizing:border-box; padding:6px 8px; border:1px solid #ccc; border-radius:6px; }
      .actions { width:1%; white-space:nowrap; }
      .muted { color:#666; font-size:12px; }
      .empty { padding:12px 10px; }
    `, a = e.map((l) => {
      const c = this._config.allowSort ? "sortable" : "", b = this._sort.field === l.field ? this._sort.dir === "asc" ? "▲" : "▼" : "";
      return `<th class="${c}" data-sort="${l.field}">${l.label}<span class="sort">${b}</span></th>`;
    }).join(""), n = this._config.allowDelete ? '<th class="actions">Actions</th>' : "", i = t.length === 0 ? `<tr><td class="empty" colspan="${e.length + (this._config.allowDelete ? 1 : 0)}">
           <span class="muted">No rows. ${this._canAdd() ? "Click “Add row” to begin." : ""}</span>
         </td></tr>` : t.map((l, c) => {
      const p = e.map((T) => {
        const Y = l == null ? void 0 : l[T.field];
        return T.editable && !this._config.readOnly ? T.type === "number" ? `<td><input type="number" data-r="${c}" data-f="${T.field}" value="${Number(Y ?? 0)}" /></td>` : T.type === "boolean" || T.type === "checkbox" ? `<td><input type="checkbox" data-r="${c}" data-f="${T.field}" ${Y ? "checked" : ""} /></td>` : `<td><input type="text" data-r="${c}" data-f="${T.field}" value="${String(Y ?? "")}" /></td>` : `<td>${Y ?? ""}</td>`;
      }).join(""), b = this._config.allowDelete ? `<td class="actions"><button type="button" data-del="${c}" ${this._canDelete() ? "" : "disabled"}>Delete</button></td>` : "";
      return `<tr>${p}${b}</tr>`;
    }).join("");
    this.shadowRoot.innerHTML = `
      <style>${s}</style>
      <div class="wrap">
        <div class="toolbar">
          ${this._config.allowAdd ? `<button type="button" id="addRow" ${this._canAdd() ? "" : "disabled"}>Add row</button>` : ""}
          <span class="muted">${t.length} row(s)</span>
        </div>
        <table>
          <thead><tr>${a}${n}</tr></thead>
          <tbody>${i}</tbody>
        </table>
      </div>
    `;
    const o = this.shadowRoot.getElementById("addRow");
    o && o.addEventListener("click", this._onAddRow), this._config.allowSort && this.shadowRoot.querySelectorAll("th[data-sort]").forEach((l) => {
      l.addEventListener("click", () => this._toggleSort(l.getAttribute("data-sort")));
    }), this.shadowRoot.querySelectorAll("input[data-r][data-f]").forEach((l) => {
      const c = Number(l.getAttribute("data-r")), p = l.getAttribute("data-f");
      l.type === "checkbox" ? l.addEventListener("change", (b) => this._onEditCell(c, p, b.target.checked)) : (l.addEventListener("blur", (b) => this._onEditCell(c, p, b.target.value)), l.addEventListener("keydown", (b) => {
        b.key === "Enter" && (b.preventDefault(), b.target.blur());
      }));
    }), this.shadowRoot.querySelectorAll("button[data-del]").forEach((l) => {
      l.addEventListener("click", () => this._onDeleteRow(Number(l.getAttribute("data-del"))));
    });
  }
}
customElements.define("central-table-grid", yt);
