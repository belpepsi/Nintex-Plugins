var _;
(function(s) {
  s.assertEqual = (a) => {
  };
  function e(a) {
  }
  s.assertIs = e;
  function t(a) {
    throw new Error();
  }
  s.assertNever = t, s.arrayToEnum = (a) => {
    const n = {};
    for (const i of a)
      n[i] = i;
    return n;
  }, s.getValidEnumValues = (a) => {
    const n = s.objectKeys(a).filter((o) => typeof a[a[o]] != "number"), i = {};
    for (const o of n)
      i[o] = a[o];
    return s.objectValues(i);
  }, s.objectValues = (a) => s.objectKeys(a).map(function(n) {
    return a[n];
  }), s.objectKeys = typeof Object.keys == "function" ? (a) => Object.keys(a) : (a) => {
    const n = [];
    for (const i in a)
      Object.prototype.hasOwnProperty.call(a, i) && n.push(i);
    return n;
  }, s.find = (a, n) => {
    for (const i of a)
      if (n(i))
        return i;
  }, s.isInteger = typeof Number.isInteger == "function" ? (a) => Number.isInteger(a) : (a) => typeof a == "number" && Number.isFinite(a) && Math.floor(a) === a;
  function r(a, n = " | ") {
    return a.map((i) => typeof i == "string" ? `'${i}'` : i).join(n);
  }
  s.joinValues = r, s.jsonStringifyReplacer = (a, n) => typeof n == "bigint" ? n.toString() : n;
})(_ || (_ = {}));
var fe;
(function(s) {
  s.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(fe || (fe = {}));
const u = _.arrayToEnum([
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
]), R = (s) => {
  switch (typeof s) {
    case "undefined":
      return u.undefined;
    case "string":
      return u.string;
    case "number":
      return Number.isNaN(s) ? u.nan : u.number;
    case "boolean":
      return u.boolean;
    case "function":
      return u.function;
    case "bigint":
      return u.bigint;
    case "symbol":
      return u.symbol;
    case "object":
      return Array.isArray(s) ? u.array : s === null ? u.null : s.then && typeof s.then == "function" && s.catch && typeof s.catch == "function" ? u.promise : typeof Map < "u" && s instanceof Map ? u.map : typeof Set < "u" && s instanceof Set ? u.set : typeof Date < "u" && s instanceof Date ? u.date : u.object;
    default:
      return u.unknown;
  }
}, d = _.arrayToEnum([
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
class Z extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (r) => {
      this.issues = [...this.issues, r];
    }, this.addIssues = (r = []) => {
      this.issues = [...this.issues, ...r];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const t = e || function(n) {
      return n.message;
    }, r = { _errors: [] }, a = (n) => {
      for (const i of n.issues)
        if (i.code === "invalid_union")
          i.unionErrors.map(a);
        else if (i.code === "invalid_return_type")
          a(i.returnTypeError);
        else if (i.code === "invalid_arguments")
          a(i.argumentsError);
        else if (i.path.length === 0)
          r._errors.push(t(i));
        else {
          let o = r, h = 0;
          for (; h < i.path.length; ) {
            const f = i.path[h];
            h === i.path.length - 1 ? (o[f] = o[f] || { _errors: [] }, o[f]._errors.push(t(i))) : o[f] = o[f] || { _errors: [] }, o = o[f], h++;
          }
        }
    };
    return a(this), r;
  }
  static assert(e) {
    if (!(e instanceof Z))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, _.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, r = [];
    for (const a of this.issues)
      if (a.path.length > 0) {
        const n = a.path[0];
        t[n] = t[n] || [], t[n].push(e(a));
      } else
        r.push(e(a));
    return { formErrors: r, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
Z.create = (s) => new Z(s);
const se = (s, e) => {
  let t;
  switch (s.code) {
    case d.invalid_type:
      s.received === u.undefined ? t = "Required" : t = `Expected ${s.expected}, received ${s.received}`;
      break;
    case d.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(s.expected, _.jsonStringifyReplacer)}`;
      break;
    case d.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${_.joinValues(s.keys, ", ")}`;
      break;
    case d.invalid_union:
      t = "Invalid input";
      break;
    case d.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${_.joinValues(s.options)}`;
      break;
    case d.invalid_enum_value:
      t = `Invalid enum value. Expected ${_.joinValues(s.options)}, received '${s.received}'`;
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
      typeof s.validation == "object" ? "includes" in s.validation ? (t = `Invalid input: must include "${s.validation.includes}"`, typeof s.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${s.validation.position}`)) : "startsWith" in s.validation ? t = `Invalid input: must start with "${s.validation.startsWith}"` : "endsWith" in s.validation ? t = `Invalid input: must end with "${s.validation.endsWith}"` : _.assertNever(s.validation) : s.validation !== "regex" ? t = `Invalid ${s.validation}` : t = "Invalid";
      break;
    case d.too_small:
      s.type === "array" ? t = `Array must contain ${s.exact ? "exactly" : s.inclusive ? "at least" : "more than"} ${s.minimum} element(s)` : s.type === "string" ? t = `String must contain ${s.exact ? "exactly" : s.inclusive ? "at least" : "over"} ${s.minimum} character(s)` : s.type === "number" ? t = `Number must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${s.minimum}` : s.type === "bigint" ? t = `Number must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${s.minimum}` : s.type === "date" ? t = `Date must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(s.minimum))}` : t = "Invalid input";
      break;
    case d.too_big:
      s.type === "array" ? t = `Array must contain ${s.exact ? "exactly" : s.inclusive ? "at most" : "less than"} ${s.maximum} element(s)` : s.type === "string" ? t = `String must contain ${s.exact ? "exactly" : s.inclusive ? "at most" : "under"} ${s.maximum} character(s)` : s.type === "number" ? t = `Number must be ${s.exact ? "exactly" : s.inclusive ? "less than or equal to" : "less than"} ${s.maximum}` : s.type === "bigint" ? t = `BigInt must be ${s.exact ? "exactly" : s.inclusive ? "less than or equal to" : "less than"} ${s.maximum}` : s.type === "date" ? t = `Date must be ${s.exact ? "exactly" : s.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(s.maximum))}` : t = "Invalid input";
      break;
    case d.custom:
      t = "Invalid input";
      break;
    case d.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case d.not_multiple_of:
      t = `Number must be a multiple of ${s.multipleOf}`;
      break;
    case d.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, _.assertNever(s);
  }
  return { message: t };
};
let Me = se;
function ze() {
  return Me;
}
const De = (s) => {
  const { data: e, path: t, errorMaps: r, issueData: a } = s, n = [...t, ...a.path || []], i = {
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
  const h = r.filter((f) => !!f).slice().reverse();
  for (const f of h)
    o = f(i, { data: e, defaultError: o }).message;
  return {
    ...a,
    path: n,
    message: o
  };
};
function c(s, e) {
  const t = ze(), r = De({
    issueData: e,
    data: s.data,
    path: s.path,
    errorMaps: [
      s.common.contextualErrorMap,
      // contextual error map is first priority
      s.schemaErrorMap,
      // then schema-bound map if available
      t,
      // then global override map
      t === se ? void 0 : se
      // then global default map
    ].filter((a) => !!a)
  });
  s.common.issues.push(r);
}
class w {
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
    const r = [];
    for (const a of t) {
      if (a.status === "aborted")
        return p;
      a.status === "dirty" && e.dirty(), r.push(a.value);
    }
    return { status: e.value, value: r };
  }
  static async mergeObjectAsync(e, t) {
    const r = [];
    for (const a of t) {
      const n = await a.key, i = await a.value;
      r.push({
        key: n,
        value: i
      });
    }
    return w.mergeObjectSync(e, r);
  }
  static mergeObjectSync(e, t) {
    const r = {};
    for (const a of t) {
      const { key: n, value: i } = a;
      if (n.status === "aborted" || i.status === "aborted")
        return p;
      n.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), n.value !== "__proto__" && (typeof i.value < "u" || a.alwaysSet) && (r[n.value] = i.value);
    }
    return { status: e.value, value: r };
  }
}
const p = Object.freeze({
  status: "aborted"
}), q = (s) => ({ status: "dirty", value: s }), C = (s) => ({ status: "valid", value: s }), me = (s) => s.status === "aborted", pe = (s) => s.status === "dirty", V = (s) => s.status === "valid", H = (s) => typeof Promise < "u" && s instanceof Promise;
var l;
(function(s) {
  s.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, s.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(l || (l = {}));
class O {
  constructor(e, t, r, a) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = r, this._key = a;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const ye = (s, e) => {
  if (V(e))
    return { success: !0, data: e.value };
  if (!s.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new Z(s.common.issues);
      return this._error = t, this._error;
    }
  };
};
function y(s) {
  if (!s)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: r, description: a } = s;
  if (e && (t || r))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: a } : { errorMap: (i, o) => {
    const { message: h } = s;
    return i.code === "invalid_enum_value" ? { message: h ?? o.defaultError } : typeof o.data > "u" ? { message: h ?? r ?? o.defaultError } : i.code !== "invalid_type" ? { message: o.defaultError } : { message: h ?? t ?? o.defaultError };
  }, description: a };
}
class g {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return R(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: R(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new w(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: R(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (H(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const r = this.safeParse(e, t);
    if (r.success)
      return r.data;
    throw r.error;
  }
  safeParse(e, t) {
    const r = {
      common: {
        issues: [],
        async: (t == null ? void 0 : t.async) ?? !1,
        contextualErrorMap: t == null ? void 0 : t.errorMap
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: R(e)
    }, a = this._parseSync({ data: e, path: r.path, parent: r });
    return ye(r, a);
  }
  "~validate"(e) {
    var r, a;
    const t = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: R(e)
    };
    if (!this["~standard"].async)
      try {
        const n = this._parseSync({ data: e, path: [], parent: t });
        return V(n) ? {
          value: n.value
        } : {
          issues: t.common.issues
        };
      } catch (n) {
        (a = (r = n == null ? void 0 : n.message) == null ? void 0 : r.toLowerCase()) != null && a.includes("encountered") && (this["~standard"].async = !0), t.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: t }).then((n) => V(n) ? {
      value: n.value
    } : {
      issues: t.common.issues
    });
  }
  async parseAsync(e, t) {
    const r = await this.safeParseAsync(e, t);
    if (r.success)
      return r.data;
    throw r.error;
  }
  async safeParseAsync(e, t) {
    const r = {
      common: {
        issues: [],
        contextualErrorMap: t == null ? void 0 : t.errorMap,
        async: !0
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: R(e)
    }, a = this._parse({ data: e, path: r.path, parent: r }), n = await (H(a) ? a : Promise.resolve(a));
    return ye(r, n);
  }
  refine(e, t) {
    const r = (a) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(a) : t;
    return this._refinement((a, n) => {
      const i = e(a), o = () => n.addIssue({
        code: d.custom,
        ...r(a)
      });
      return typeof Promise < "u" && i instanceof Promise ? i.then((h) => h ? !0 : (o(), !1)) : i ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((r, a) => e(r) ? !0 : (a.addIssue(typeof t == "function" ? t(r, a) : t), !1));
  }
  _refinement(e) {
    return new M({
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
    return z.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return S.create(this);
  }
  promise() {
    return ee.create(this, this._def);
  }
  or(e) {
    return Q.create([this, e], this._def);
  }
  and(e) {
    return X.create(this, e, this._def);
  }
  transform(e) {
    return new M({
      ...y(this._def),
      schema: this,
      typeName: m.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new de({
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
    return new ce({
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
    return le.create(this, e);
  }
  readonly() {
    return ue.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Ue = /^c[^\s-]{8,}$/i, Be = /^[0-9a-z]+$/, Fe = /^[0-9A-HJKMNP-TV-Z]{26}$/i, We = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, qe = /^[a-z0-9_-]{21}$/i, Je = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Ge = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, He = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Ye = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let re;
const Qe = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Xe = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, Ke = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, et = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, tt = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, rt = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, Se = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", st = new RegExp(`^${Se}$`);
function Oe(s) {
  let e = "[0-5]\\d";
  s.precision ? e = `${e}\\.\\d{${s.precision}}` : s.precision == null && (e = `${e}(\\.\\d+)?`);
  const t = s.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
function at(s) {
  return new RegExp(`^${Oe(s)}$`);
}
function nt(s) {
  let e = `${Se}T${Oe(s)}`;
  const t = [];
  return t.push(s.local ? "Z?" : "Z"), s.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function it(s, e) {
  return !!((e === "v4" || !e) && Qe.test(s) || (e === "v6" || !e) && Ke.test(s));
}
function ot(s, e) {
  if (!Je.test(s))
    return !1;
  try {
    const [t] = s.split(".");
    if (!t)
      return !1;
    const r = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), a = JSON.parse(atob(r));
    return !(typeof a != "object" || a === null || "typ" in a && (a == null ? void 0 : a.typ) !== "JWT" || !a.alg || e && a.alg !== e);
  } catch {
    return !1;
  }
}
function dt(s, e) {
  return !!((e === "v4" || !e) && Xe.test(s) || (e === "v6" || !e) && et.test(s));
}
class A extends g {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== u.string) {
      const n = this._getOrReturnCtx(e);
      return c(n, {
        code: d.invalid_type,
        expected: u.string,
        received: n.parsedType
      }), p;
    }
    const r = new w();
    let a;
    for (const n of this._def.checks)
      if (n.kind === "min")
        e.data.length < n.value && (a = this._getOrReturnCtx(e, a), c(a, {
          code: d.too_small,
          minimum: n.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: n.message
        }), r.dirty());
      else if (n.kind === "max")
        e.data.length > n.value && (a = this._getOrReturnCtx(e, a), c(a, {
          code: d.too_big,
          maximum: n.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: n.message
        }), r.dirty());
      else if (n.kind === "length") {
        const i = e.data.length > n.value, o = e.data.length < n.value;
        (i || o) && (a = this._getOrReturnCtx(e, a), i ? c(a, {
          code: d.too_big,
          maximum: n.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: n.message
        }) : o && c(a, {
          code: d.too_small,
          minimum: n.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: n.message
        }), r.dirty());
      } else if (n.kind === "email")
        He.test(e.data) || (a = this._getOrReturnCtx(e, a), c(a, {
          validation: "email",
          code: d.invalid_string,
          message: n.message
        }), r.dirty());
      else if (n.kind === "emoji")
        re || (re = new RegExp(Ye, "u")), re.test(e.data) || (a = this._getOrReturnCtx(e, a), c(a, {
          validation: "emoji",
          code: d.invalid_string,
          message: n.message
        }), r.dirty());
      else if (n.kind === "uuid")
        We.test(e.data) || (a = this._getOrReturnCtx(e, a), c(a, {
          validation: "uuid",
          code: d.invalid_string,
          message: n.message
        }), r.dirty());
      else if (n.kind === "nanoid")
        qe.test(e.data) || (a = this._getOrReturnCtx(e, a), c(a, {
          validation: "nanoid",
          code: d.invalid_string,
          message: n.message
        }), r.dirty());
      else if (n.kind === "cuid")
        Ue.test(e.data) || (a = this._getOrReturnCtx(e, a), c(a, {
          validation: "cuid",
          code: d.invalid_string,
          message: n.message
        }), r.dirty());
      else if (n.kind === "cuid2")
        Be.test(e.data) || (a = this._getOrReturnCtx(e, a), c(a, {
          validation: "cuid2",
          code: d.invalid_string,
          message: n.message
        }), r.dirty());
      else if (n.kind === "ulid")
        Fe.test(e.data) || (a = this._getOrReturnCtx(e, a), c(a, {
          validation: "ulid",
          code: d.invalid_string,
          message: n.message
        }), r.dirty());
      else if (n.kind === "url")
        try {
          new URL(e.data);
        } catch {
          a = this._getOrReturnCtx(e, a), c(a, {
            validation: "url",
            code: d.invalid_string,
            message: n.message
          }), r.dirty();
        }
      else n.kind === "regex" ? (n.regex.lastIndex = 0, n.regex.test(e.data) || (a = this._getOrReturnCtx(e, a), c(a, {
        validation: "regex",
        code: d.invalid_string,
        message: n.message
      }), r.dirty())) : n.kind === "trim" ? e.data = e.data.trim() : n.kind === "includes" ? e.data.includes(n.value, n.position) || (a = this._getOrReturnCtx(e, a), c(a, {
        code: d.invalid_string,
        validation: { includes: n.value, position: n.position },
        message: n.message
      }), r.dirty()) : n.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : n.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : n.kind === "startsWith" ? e.data.startsWith(n.value) || (a = this._getOrReturnCtx(e, a), c(a, {
        code: d.invalid_string,
        validation: { startsWith: n.value },
        message: n.message
      }), r.dirty()) : n.kind === "endsWith" ? e.data.endsWith(n.value) || (a = this._getOrReturnCtx(e, a), c(a, {
        code: d.invalid_string,
        validation: { endsWith: n.value },
        message: n.message
      }), r.dirty()) : n.kind === "datetime" ? nt(n).test(e.data) || (a = this._getOrReturnCtx(e, a), c(a, {
        code: d.invalid_string,
        validation: "datetime",
        message: n.message
      }), r.dirty()) : n.kind === "date" ? st.test(e.data) || (a = this._getOrReturnCtx(e, a), c(a, {
        code: d.invalid_string,
        validation: "date",
        message: n.message
      }), r.dirty()) : n.kind === "time" ? at(n).test(e.data) || (a = this._getOrReturnCtx(e, a), c(a, {
        code: d.invalid_string,
        validation: "time",
        message: n.message
      }), r.dirty()) : n.kind === "duration" ? Ge.test(e.data) || (a = this._getOrReturnCtx(e, a), c(a, {
        validation: "duration",
        code: d.invalid_string,
        message: n.message
      }), r.dirty()) : n.kind === "ip" ? it(e.data, n.version) || (a = this._getOrReturnCtx(e, a), c(a, {
        validation: "ip",
        code: d.invalid_string,
        message: n.message
      }), r.dirty()) : n.kind === "jwt" ? ot(e.data, n.alg) || (a = this._getOrReturnCtx(e, a), c(a, {
        validation: "jwt",
        code: d.invalid_string,
        message: n.message
      }), r.dirty()) : n.kind === "cidr" ? dt(e.data, n.version) || (a = this._getOrReturnCtx(e, a), c(a, {
        validation: "cidr",
        code: d.invalid_string,
        message: n.message
      }), r.dirty()) : n.kind === "base64" ? tt.test(e.data) || (a = this._getOrReturnCtx(e, a), c(a, {
        validation: "base64",
        code: d.invalid_string,
        message: n.message
      }), r.dirty()) : n.kind === "base64url" ? rt.test(e.data) || (a = this._getOrReturnCtx(e, a), c(a, {
        validation: "base64url",
        code: d.invalid_string,
        message: n.message
      }), r.dirty()) : _.assertNever(n);
    return { status: r.value, value: e.data };
  }
  _regex(e, t, r) {
    return this.refinement((a) => e.test(a), {
      validation: t,
      code: d.invalid_string,
      ...l.errToObj(r)
    });
  }
  _addCheck(e) {
    return new A({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...l.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...l.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...l.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...l.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...l.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...l.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...l.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...l.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...l.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...l.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...l.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...l.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...l.errToObj(e) });
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
      ...l.errToObj(e == null ? void 0 : e.message)
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
      ...l.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...l.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...l.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t == null ? void 0 : t.position,
      ...l.errToObj(t == null ? void 0 : t.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...l.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...l.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...l.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...l.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...l.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, l.errToObj(e));
  }
  trim() {
    return new A({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new A({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new A({
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
A.create = (s) => new A({
  checks: [],
  typeName: m.ZodString,
  coerce: (s == null ? void 0 : s.coerce) ?? !1,
  ...y(s)
});
function ct(s, e) {
  const t = (s.toString().split(".")[1] || "").length, r = (e.toString().split(".")[1] || "").length, a = t > r ? t : r, n = Number.parseInt(s.toFixed(a).replace(".", "")), i = Number.parseInt(e.toFixed(a).replace(".", ""));
  return n % i / 10 ** a;
}
class L extends g {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== u.number) {
      const n = this._getOrReturnCtx(e);
      return c(n, {
        code: d.invalid_type,
        expected: u.number,
        received: n.parsedType
      }), p;
    }
    let r;
    const a = new w();
    for (const n of this._def.checks)
      n.kind === "int" ? _.isInteger(e.data) || (r = this._getOrReturnCtx(e, r), c(r, {
        code: d.invalid_type,
        expected: "integer",
        received: "float",
        message: n.message
      }), a.dirty()) : n.kind === "min" ? (n.inclusive ? e.data < n.value : e.data <= n.value) && (r = this._getOrReturnCtx(e, r), c(r, {
        code: d.too_small,
        minimum: n.value,
        type: "number",
        inclusive: n.inclusive,
        exact: !1,
        message: n.message
      }), a.dirty()) : n.kind === "max" ? (n.inclusive ? e.data > n.value : e.data >= n.value) && (r = this._getOrReturnCtx(e, r), c(r, {
        code: d.too_big,
        maximum: n.value,
        type: "number",
        inclusive: n.inclusive,
        exact: !1,
        message: n.message
      }), a.dirty()) : n.kind === "multipleOf" ? ct(e.data, n.value) !== 0 && (r = this._getOrReturnCtx(e, r), c(r, {
        code: d.not_multiple_of,
        multipleOf: n.value,
        message: n.message
      }), a.dirty()) : n.kind === "finite" ? Number.isFinite(e.data) || (r = this._getOrReturnCtx(e, r), c(r, {
        code: d.not_finite,
        message: n.message
      }), a.dirty()) : _.assertNever(n);
    return { status: a.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, l.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, l.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, l.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, l.toString(t));
  }
  setLimit(e, t, r, a) {
    return new L({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: r,
          message: l.toString(a)
        }
      ]
    });
  }
  _addCheck(e) {
    return new L({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: l.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: l.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: l.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: l.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: l.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: l.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: l.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: l.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: l.toString(e)
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
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && _.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const r of this._def.checks) {
      if (r.kind === "finite" || r.kind === "int" || r.kind === "multipleOf")
        return !0;
      r.kind === "min" ? (t === null || r.value > t) && (t = r.value) : r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
L.create = (s) => new L({
  checks: [],
  typeName: m.ZodNumber,
  coerce: (s == null ? void 0 : s.coerce) || !1,
  ...y(s)
});
class J extends g {
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
    if (this._getType(e) !== u.bigint)
      return this._getInvalidInput(e);
    let r;
    const a = new w();
    for (const n of this._def.checks)
      n.kind === "min" ? (n.inclusive ? e.data < n.value : e.data <= n.value) && (r = this._getOrReturnCtx(e, r), c(r, {
        code: d.too_small,
        type: "bigint",
        minimum: n.value,
        inclusive: n.inclusive,
        message: n.message
      }), a.dirty()) : n.kind === "max" ? (n.inclusive ? e.data > n.value : e.data >= n.value) && (r = this._getOrReturnCtx(e, r), c(r, {
        code: d.too_big,
        type: "bigint",
        maximum: n.value,
        inclusive: n.inclusive,
        message: n.message
      }), a.dirty()) : n.kind === "multipleOf" ? e.data % n.value !== BigInt(0) && (r = this._getOrReturnCtx(e, r), c(r, {
        code: d.not_multiple_of,
        multipleOf: n.value,
        message: n.message
      }), a.dirty()) : _.assertNever(n);
    return { status: a.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return c(t, {
      code: d.invalid_type,
      expected: u.bigint,
      received: t.parsedType
    }), p;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, l.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, l.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, l.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, l.toString(t));
  }
  setLimit(e, t, r, a) {
    return new J({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: r,
          message: l.toString(a)
        }
      ]
    });
  }
  _addCheck(e) {
    return new J({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: l.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: l.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: l.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: l.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: l.toString(t)
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
J.create = (s) => new J({
  checks: [],
  typeName: m.ZodBigInt,
  coerce: (s == null ? void 0 : s.coerce) ?? !1,
  ...y(s)
});
class ae extends g {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== u.boolean) {
      const r = this._getOrReturnCtx(e);
      return c(r, {
        code: d.invalid_type,
        expected: u.boolean,
        received: r.parsedType
      }), p;
    }
    return C(e.data);
  }
}
ae.create = (s) => new ae({
  typeName: m.ZodBoolean,
  coerce: (s == null ? void 0 : s.coerce) || !1,
  ...y(s)
});
class Y extends g {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== u.date) {
      const n = this._getOrReturnCtx(e);
      return c(n, {
        code: d.invalid_type,
        expected: u.date,
        received: n.parsedType
      }), p;
    }
    if (Number.isNaN(e.data.getTime())) {
      const n = this._getOrReturnCtx(e);
      return c(n, {
        code: d.invalid_date
      }), p;
    }
    const r = new w();
    let a;
    for (const n of this._def.checks)
      n.kind === "min" ? e.data.getTime() < n.value && (a = this._getOrReturnCtx(e, a), c(a, {
        code: d.too_small,
        message: n.message,
        inclusive: !0,
        exact: !1,
        minimum: n.value,
        type: "date"
      }), r.dirty()) : n.kind === "max" ? e.data.getTime() > n.value && (a = this._getOrReturnCtx(e, a), c(a, {
        code: d.too_big,
        message: n.message,
        inclusive: !0,
        exact: !1,
        maximum: n.value,
        type: "date"
      }), r.dirty()) : _.assertNever(n);
    return {
      status: r.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new Y({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: l.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: l.toString(t)
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
Y.create = (s) => new Y({
  checks: [],
  coerce: (s == null ? void 0 : s.coerce) || !1,
  typeName: m.ZodDate,
  ...y(s)
});
class ge extends g {
  _parse(e) {
    if (this._getType(e) !== u.symbol) {
      const r = this._getOrReturnCtx(e);
      return c(r, {
        code: d.invalid_type,
        expected: u.symbol,
        received: r.parsedType
      }), p;
    }
    return C(e.data);
  }
}
ge.create = (s) => new ge({
  typeName: m.ZodSymbol,
  ...y(s)
});
class _e extends g {
  _parse(e) {
    if (this._getType(e) !== u.undefined) {
      const r = this._getOrReturnCtx(e);
      return c(r, {
        code: d.invalid_type,
        expected: u.undefined,
        received: r.parsedType
      }), p;
    }
    return C(e.data);
  }
}
_e.create = (s) => new _e({
  typeName: m.ZodUndefined,
  ...y(s)
});
class ve extends g {
  _parse(e) {
    if (this._getType(e) !== u.null) {
      const r = this._getOrReturnCtx(e);
      return c(r, {
        code: d.invalid_type,
        expected: u.null,
        received: r.parsedType
      }), p;
    }
    return C(e.data);
  }
}
ve.create = (s) => new ve({
  typeName: m.ZodNull,
  ...y(s)
});
class xe extends g {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return C(e.data);
  }
}
xe.create = (s) => new xe({
  typeName: m.ZodAny,
  ...y(s)
});
class ke extends g {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return C(e.data);
  }
}
ke.create = (s) => new ke({
  typeName: m.ZodUnknown,
  ...y(s)
});
class I extends g {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return c(t, {
      code: d.invalid_type,
      expected: u.never,
      received: t.parsedType
    }), p;
  }
}
I.create = (s) => new I({
  typeName: m.ZodNever,
  ...y(s)
});
class be extends g {
  _parse(e) {
    if (this._getType(e) !== u.undefined) {
      const r = this._getOrReturnCtx(e);
      return c(r, {
        code: d.invalid_type,
        expected: u.void,
        received: r.parsedType
      }), p;
    }
    return C(e.data);
  }
}
be.create = (s) => new be({
  typeName: m.ZodVoid,
  ...y(s)
});
class S extends g {
  _parse(e) {
    const { ctx: t, status: r } = this._processInputParams(e), a = this._def;
    if (t.parsedType !== u.array)
      return c(t, {
        code: d.invalid_type,
        expected: u.array,
        received: t.parsedType
      }), p;
    if (a.exactLength !== null) {
      const i = t.data.length > a.exactLength.value, o = t.data.length < a.exactLength.value;
      (i || o) && (c(t, {
        code: i ? d.too_big : d.too_small,
        minimum: o ? a.exactLength.value : void 0,
        maximum: i ? a.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: a.exactLength.message
      }), r.dirty());
    }
    if (a.minLength !== null && t.data.length < a.minLength.value && (c(t, {
      code: d.too_small,
      minimum: a.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: a.minLength.message
    }), r.dirty()), a.maxLength !== null && t.data.length > a.maxLength.value && (c(t, {
      code: d.too_big,
      maximum: a.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: a.maxLength.message
    }), r.dirty()), t.common.async)
      return Promise.all([...t.data].map((i, o) => a.type._parseAsync(new O(t, i, t.path, o)))).then((i) => w.mergeArray(r, i));
    const n = [...t.data].map((i, o) => a.type._parseSync(new O(t, i, t.path, o)));
    return w.mergeArray(r, n);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new S({
      ...this._def,
      minLength: { value: e, message: l.toString(t) }
    });
  }
  max(e, t) {
    return new S({
      ...this._def,
      maxLength: { value: e, message: l.toString(t) }
    });
  }
  length(e, t) {
    return new S({
      ...this._def,
      exactLength: { value: e, message: l.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
S.create = (s, e) => new S({
  type: s,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: m.ZodArray,
  ...y(e)
});
function $(s) {
  if (s instanceof x) {
    const e = {};
    for (const t in s.shape) {
      const r = s.shape[t];
      e[t] = j.create($(r));
    }
    return new x({
      ...s._def,
      shape: () => e
    });
  } else return s instanceof S ? new S({
    ...s._def,
    type: $(s.element)
  }) : s instanceof j ? j.create($(s.unwrap())) : s instanceof z ? z.create($(s.unwrap())) : s instanceof E ? E.create(s.items.map((e) => $(e))) : s;
}
class x extends g {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = _.objectKeys(e);
    return this._cached = { shape: e, keys: t }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== u.object) {
      const f = this._getOrReturnCtx(e);
      return c(f, {
        code: d.invalid_type,
        expected: u.object,
        received: f.parsedType
      }), p;
    }
    const { status: r, ctx: a } = this._processInputParams(e), { shape: n, keys: i } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof I && this._def.unknownKeys === "strip"))
      for (const f in a.data)
        i.includes(f) || o.push(f);
    const h = [];
    for (const f of i) {
      const v = n[f], W = a.data[f];
      h.push({
        key: { status: "valid", value: f },
        value: v._parse(new O(a, W, a.path, f)),
        alwaysSet: f in a.data
      });
    }
    if (this._def.catchall instanceof I) {
      const f = this._def.unknownKeys;
      if (f === "passthrough")
        for (const v of o)
          h.push({
            key: { status: "valid", value: v },
            value: { status: "valid", value: a.data[v] }
          });
      else if (f === "strict")
        o.length > 0 && (c(a, {
          code: d.unrecognized_keys,
          keys: o
        }), r.dirty());
      else if (f !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const f = this._def.catchall;
      for (const v of o) {
        const W = a.data[v];
        h.push({
          key: { status: "valid", value: v },
          value: f._parse(
            new O(a, W, a.path, v)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: v in a.data
        });
      }
    }
    return a.common.async ? Promise.resolve().then(async () => {
      const f = [];
      for (const v of h) {
        const W = await v.key, Pe = await v.value;
        f.push({
          key: W,
          value: Pe,
          alwaysSet: v.alwaysSet
        });
      }
      return f;
    }).then((f) => w.mergeObjectSync(r, f)) : w.mergeObjectSync(r, h);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return l.errToObj, new x({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, r) => {
          var n, i;
          const a = ((i = (n = this._def).errorMap) == null ? void 0 : i.call(n, t, r).message) ?? r.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: l.errToObj(e).message ?? a
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
    for (const r of _.objectKeys(e))
      e[r] && this.shape[r] && (t[r] = this.shape[r]);
    return new x({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    for (const r of _.objectKeys(this.shape))
      e[r] || (t[r] = this.shape[r]);
    return new x({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return $(this);
  }
  partial(e) {
    const t = {};
    for (const r of _.objectKeys(this.shape)) {
      const a = this.shape[r];
      e && !e[r] ? t[r] = a : t[r] = a.optional();
    }
    return new x({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    for (const r of _.objectKeys(this.shape))
      if (e && !e[r])
        t[r] = this.shape[r];
      else {
        let n = this.shape[r];
        for (; n instanceof j; )
          n = n._def.innerType;
        t[r] = n;
      }
    return new x({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return Ne(_.objectKeys(this.shape));
  }
}
x.create = (s, e) => new x({
  shape: () => s,
  unknownKeys: "strip",
  catchall: I.create(),
  typeName: m.ZodObject,
  ...y(e)
});
x.strictCreate = (s, e) => new x({
  shape: () => s,
  unknownKeys: "strict",
  catchall: I.create(),
  typeName: m.ZodObject,
  ...y(e)
});
x.lazycreate = (s, e) => new x({
  shape: s,
  unknownKeys: "strip",
  catchall: I.create(),
  typeName: m.ZodObject,
  ...y(e)
});
class Q extends g {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), r = this._def.options;
    function a(n) {
      for (const o of n)
        if (o.result.status === "valid")
          return o.result;
      for (const o of n)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const i = n.map((o) => new Z(o.ctx.common.issues));
      return c(t, {
        code: d.invalid_union,
        unionErrors: i
      }), p;
    }
    if (t.common.async)
      return Promise.all(r.map(async (n) => {
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
      for (const h of r) {
        const f = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, v = h._parseSync({
          data: t.data,
          path: t.path,
          parent: f
        });
        if (v.status === "valid")
          return v;
        v.status === "dirty" && !n && (n = { result: v, ctx: f }), f.common.issues.length && i.push(f.common.issues);
      }
      if (n)
        return t.common.issues.push(...n.ctx.common.issues), n.result;
      const o = i.map((h) => new Z(h));
      return c(t, {
        code: d.invalid_union,
        unionErrors: o
      }), p;
    }
  }
  get options() {
    return this._def.options;
  }
}
Q.create = (s, e) => new Q({
  options: s,
  typeName: m.ZodUnion,
  ...y(e)
});
function ne(s, e) {
  const t = R(s), r = R(e);
  if (s === e)
    return { valid: !0, data: s };
  if (t === u.object && r === u.object) {
    const a = _.objectKeys(e), n = _.objectKeys(s).filter((o) => a.indexOf(o) !== -1), i = { ...s, ...e };
    for (const o of n) {
      const h = ne(s[o], e[o]);
      if (!h.valid)
        return { valid: !1 };
      i[o] = h.data;
    }
    return { valid: !0, data: i };
  } else if (t === u.array && r === u.array) {
    if (s.length !== e.length)
      return { valid: !1 };
    const a = [];
    for (let n = 0; n < s.length; n++) {
      const i = s[n], o = e[n], h = ne(i, o);
      if (!h.valid)
        return { valid: !1 };
      a.push(h.data);
    }
    return { valid: !0, data: a };
  } else return t === u.date && r === u.date && +s == +e ? { valid: !0, data: s } : { valid: !1 };
}
class X extends g {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e), a = (n, i) => {
      if (me(n) || me(i))
        return p;
      const o = ne(n.value, i.value);
      return o.valid ? ((pe(n) || pe(i)) && t.dirty(), { status: t.value, value: o.data }) : (c(r, {
        code: d.invalid_intersection_types
      }), p);
    };
    return r.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: r.data,
        path: r.path,
        parent: r
      }),
      this._def.right._parseAsync({
        data: r.data,
        path: r.path,
        parent: r
      })
    ]).then(([n, i]) => a(n, i)) : a(this._def.left._parseSync({
      data: r.data,
      path: r.path,
      parent: r
    }), this._def.right._parseSync({
      data: r.data,
      path: r.path,
      parent: r
    }));
  }
}
X.create = (s, e, t) => new X({
  left: s,
  right: e,
  typeName: m.ZodIntersection,
  ...y(t)
});
class E extends g {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== u.array)
      return c(r, {
        code: d.invalid_type,
        expected: u.array,
        received: r.parsedType
      }), p;
    if (r.data.length < this._def.items.length)
      return c(r, {
        code: d.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), p;
    !this._def.rest && r.data.length > this._def.items.length && (c(r, {
      code: d.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const n = [...r.data].map((i, o) => {
      const h = this._def.items[o] || this._def.rest;
      return h ? h._parse(new O(r, i, r.path, o)) : null;
    }).filter((i) => !!i);
    return r.common.async ? Promise.all(n).then((i) => w.mergeArray(t, i)) : w.mergeArray(t, n);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new E({
      ...this._def,
      rest: e
    });
  }
}
E.create = (s, e) => {
  if (!Array.isArray(s))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new E({
    items: s,
    typeName: m.ZodTuple,
    rest: null,
    ...y(e)
  });
};
class K extends g {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== u.object)
      return c(r, {
        code: d.invalid_type,
        expected: u.object,
        received: r.parsedType
      }), p;
    const a = [], n = this._def.keyType, i = this._def.valueType;
    for (const o in r.data)
      a.push({
        key: n._parse(new O(r, o, r.path, o)),
        value: i._parse(new O(r, r.data[o], r.path, o)),
        alwaysSet: o in r.data
      });
    return r.common.async ? w.mergeObjectAsync(t, a) : w.mergeObjectSync(t, a);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, r) {
    return t instanceof g ? new K({
      keyType: e,
      valueType: t,
      typeName: m.ZodRecord,
      ...y(r)
    }) : new K({
      keyType: A.create(),
      valueType: e,
      typeName: m.ZodRecord,
      ...y(t)
    });
  }
}
class we extends g {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== u.map)
      return c(r, {
        code: d.invalid_type,
        expected: u.map,
        received: r.parsedType
      }), p;
    const a = this._def.keyType, n = this._def.valueType, i = [...r.data.entries()].map(([o, h], f) => ({
      key: a._parse(new O(r, o, r.path, [f, "key"])),
      value: n._parse(new O(r, h, r.path, [f, "value"]))
    }));
    if (r.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const h of i) {
          const f = await h.key, v = await h.value;
          if (f.status === "aborted" || v.status === "aborted")
            return p;
          (f.status === "dirty" || v.status === "dirty") && t.dirty(), o.set(f.value, v.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const h of i) {
        const f = h.key, v = h.value;
        if (f.status === "aborted" || v.status === "aborted")
          return p;
        (f.status === "dirty" || v.status === "dirty") && t.dirty(), o.set(f.value, v.value);
      }
      return { status: t.value, value: o };
    }
  }
}
we.create = (s, e, t) => new we({
  valueType: e,
  keyType: s,
  typeName: m.ZodMap,
  ...y(t)
});
class G extends g {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== u.set)
      return c(r, {
        code: d.invalid_type,
        expected: u.set,
        received: r.parsedType
      }), p;
    const a = this._def;
    a.minSize !== null && r.data.size < a.minSize.value && (c(r, {
      code: d.too_small,
      minimum: a.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: a.minSize.message
    }), t.dirty()), a.maxSize !== null && r.data.size > a.maxSize.value && (c(r, {
      code: d.too_big,
      maximum: a.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: a.maxSize.message
    }), t.dirty());
    const n = this._def.valueType;
    function i(h) {
      const f = /* @__PURE__ */ new Set();
      for (const v of h) {
        if (v.status === "aborted")
          return p;
        v.status === "dirty" && t.dirty(), f.add(v.value);
      }
      return { status: t.value, value: f };
    }
    const o = [...r.data.values()].map((h, f) => n._parse(new O(r, h, r.path, f)));
    return r.common.async ? Promise.all(o).then((h) => i(h)) : i(o);
  }
  min(e, t) {
    return new G({
      ...this._def,
      minSize: { value: e, message: l.toString(t) }
    });
  }
  max(e, t) {
    return new G({
      ...this._def,
      maxSize: { value: e, message: l.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
G.create = (s, e) => new G({
  valueType: s,
  minSize: null,
  maxSize: null,
  typeName: m.ZodSet,
  ...y(e)
});
class ie extends g {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
ie.create = (s, e) => new ie({
  getter: s,
  typeName: m.ZodLazy,
  ...y(e)
});
class oe extends g {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return c(t, {
        received: t.data,
        code: d.invalid_literal,
        expected: this._def.value
      }), p;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
oe.create = (s, e) => new oe({
  value: s,
  typeName: m.ZodLiteral,
  ...y(e)
});
function Ne(s, e) {
  return new P({
    values: s,
    typeName: m.ZodEnum,
    ...y(e)
  });
}
class P extends g {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), r = this._def.values;
      return c(t, {
        expected: _.joinValues(r),
        received: t.parsedType,
        code: d.invalid_type
      }), p;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), r = this._def.values;
      return c(t, {
        received: t.data,
        code: d.invalid_enum_value,
        options: r
      }), p;
    }
    return C(e.data);
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
    return P.create(this.options.filter((r) => !e.includes(r)), {
      ...this._def,
      ...t
    });
  }
}
P.create = Ne;
class Te extends g {
  _parse(e) {
    const t = _.getValidEnumValues(this._def.values), r = this._getOrReturnCtx(e);
    if (r.parsedType !== u.string && r.parsedType !== u.number) {
      const a = _.objectValues(t);
      return c(r, {
        expected: _.joinValues(a),
        received: r.parsedType,
        code: d.invalid_type
      }), p;
    }
    if (this._cache || (this._cache = new Set(_.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const a = _.objectValues(t);
      return c(r, {
        received: r.data,
        code: d.invalid_enum_value,
        options: a
      }), p;
    }
    return C(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
Te.create = (s, e) => new Te({
  values: s,
  typeName: m.ZodNativeEnum,
  ...y(e)
});
class ee extends g {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== u.promise && t.common.async === !1)
      return c(t, {
        code: d.invalid_type,
        expected: u.promise,
        received: t.parsedType
      }), p;
    const r = t.parsedType === u.promise ? t.data : Promise.resolve(t.data);
    return C(r.then((a) => this._def.type.parseAsync(a, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
ee.create = (s, e) => new ee({
  type: s,
  typeName: m.ZodPromise,
  ...y(e)
});
class M extends g {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === m.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e), a = this._def.effect || null, n = {
      addIssue: (i) => {
        c(r, i), i.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return r.path;
      }
    };
    if (n.addIssue = n.addIssue.bind(n), a.type === "preprocess") {
      const i = a.transform(r.data, n);
      if (r.common.async)
        return Promise.resolve(i).then(async (o) => {
          if (t.value === "aborted")
            return p;
          const h = await this._def.schema._parseAsync({
            data: o,
            path: r.path,
            parent: r
          });
          return h.status === "aborted" ? p : h.status === "dirty" || t.value === "dirty" ? q(h.value) : h;
        });
      {
        if (t.value === "aborted")
          return p;
        const o = this._def.schema._parseSync({
          data: i,
          path: r.path,
          parent: r
        });
        return o.status === "aborted" ? p : o.status === "dirty" || t.value === "dirty" ? q(o.value) : o;
      }
    }
    if (a.type === "refinement") {
      const i = (o) => {
        const h = a.refinement(o, n);
        if (r.common.async)
          return Promise.resolve(h);
        if (h instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (r.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: r.data,
          path: r.path,
          parent: r
        });
        return o.status === "aborted" ? p : (o.status === "dirty" && t.dirty(), i(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: r.data, path: r.path, parent: r }).then((o) => o.status === "aborted" ? p : (o.status === "dirty" && t.dirty(), i(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (a.type === "transform")
      if (r.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: r.data,
          path: r.path,
          parent: r
        });
        if (!V(i))
          return p;
        const o = a.transform(i.value, n);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: r.data, path: r.path, parent: r }).then((i) => V(i) ? Promise.resolve(a.transform(i.value, n)).then((o) => ({
          status: t.value,
          value: o
        })) : p);
    _.assertNever(a);
  }
}
M.create = (s, e, t) => new M({
  schema: s,
  typeName: m.ZodEffects,
  effect: e,
  ...y(t)
});
M.createWithPreprocess = (s, e, t) => new M({
  schema: e,
  effect: { type: "preprocess", transform: s },
  typeName: m.ZodEffects,
  ...y(t)
});
class j extends g {
  _parse(e) {
    return this._getType(e) === u.undefined ? C(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
j.create = (s, e) => new j({
  innerType: s,
  typeName: m.ZodOptional,
  ...y(e)
});
class z extends g {
  _parse(e) {
    return this._getType(e) === u.null ? C(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
z.create = (s, e) => new z({
  innerType: s,
  typeName: m.ZodNullable,
  ...y(e)
});
class de extends g {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let r = t.data;
    return t.parsedType === u.undefined && (r = this._def.defaultValue()), this._def.innerType._parse({
      data: r,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
de.create = (s, e) => new de({
  innerType: s,
  typeName: m.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...y(e)
});
class ce extends g {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), r = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, a = this._def.innerType._parse({
      data: r.data,
      path: r.path,
      parent: {
        ...r
      }
    });
    return H(a) ? a.then((n) => ({
      status: "valid",
      value: n.status === "valid" ? n.value : this._def.catchValue({
        get error() {
          return new Z(r.common.issues);
        },
        input: r.data
      })
    })) : {
      status: "valid",
      value: a.status === "valid" ? a.value : this._def.catchValue({
        get error() {
          return new Z(r.common.issues);
        },
        input: r.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ce.create = (s, e) => new ce({
  innerType: s,
  typeName: m.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...y(e)
});
class Ce extends g {
  _parse(e) {
    if (this._getType(e) !== u.nan) {
      const r = this._getOrReturnCtx(e);
      return c(r, {
        code: d.invalid_type,
        expected: u.nan,
        received: r.parsedType
      }), p;
    }
    return { status: "valid", value: e.data };
  }
}
Ce.create = (s) => new Ce({
  typeName: m.ZodNaN,
  ...y(s)
});
class ut extends g {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), r = t.data;
    return this._def.type._parse({
      data: r,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class le extends g {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.common.async)
      return (async () => {
        const n = await this._def.in._parseAsync({
          data: r.data,
          path: r.path,
          parent: r
        });
        return n.status === "aborted" ? p : n.status === "dirty" ? (t.dirty(), q(n.value)) : this._def.out._parseAsync({
          data: n.value,
          path: r.path,
          parent: r
        });
      })();
    {
      const a = this._def.in._parseSync({
        data: r.data,
        path: r.path,
        parent: r
      });
      return a.status === "aborted" ? p : a.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: a.value
      }) : this._def.out._parseSync({
        data: a.value,
        path: r.path,
        parent: r
      });
    }
  }
  static create(e, t) {
    return new le({
      in: e,
      out: t,
      typeName: m.ZodPipeline
    });
  }
}
class ue extends g {
  _parse(e) {
    const t = this._def.innerType._parse(e), r = (a) => (V(a) && (a.value = Object.freeze(a.value)), a);
    return H(t) ? t.then((a) => r(a)) : r(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ue.create = (s, e) => new ue({
  innerType: s,
  typeName: m.ZodReadonly,
  ...y(e)
});
var m;
(function(s) {
  s.ZodString = "ZodString", s.ZodNumber = "ZodNumber", s.ZodNaN = "ZodNaN", s.ZodBigInt = "ZodBigInt", s.ZodBoolean = "ZodBoolean", s.ZodDate = "ZodDate", s.ZodSymbol = "ZodSymbol", s.ZodUndefined = "ZodUndefined", s.ZodNull = "ZodNull", s.ZodAny = "ZodAny", s.ZodUnknown = "ZodUnknown", s.ZodNever = "ZodNever", s.ZodVoid = "ZodVoid", s.ZodArray = "ZodArray", s.ZodObject = "ZodObject", s.ZodUnion = "ZodUnion", s.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", s.ZodIntersection = "ZodIntersection", s.ZodTuple = "ZodTuple", s.ZodRecord = "ZodRecord", s.ZodMap = "ZodMap", s.ZodSet = "ZodSet", s.ZodFunction = "ZodFunction", s.ZodLazy = "ZodLazy", s.ZodLiteral = "ZodLiteral", s.ZodEnum = "ZodEnum", s.ZodEffects = "ZodEffects", s.ZodNativeEnum = "ZodNativeEnum", s.ZodOptional = "ZodOptional", s.ZodNullable = "ZodNullable", s.ZodDefault = "ZodDefault", s.ZodCatch = "ZodCatch", s.ZodPromise = "ZodPromise", s.ZodBranded = "ZodBranded", s.ZodPipeline = "ZodPipeline", s.ZodReadonly = "ZodReadonly";
})(m || (m = {}));
const k = A.create, N = L.create, b = ae.create;
I.create;
const te = S.create, T = x.create, D = Q.create, U = X.create;
E.create;
const he = K.create, Ae = ie.create, B = oe.create;
P.create;
ee.create;
j.create;
z.create;
var lt = /^\w+([_]\w+)*$/, Ze = /^\w+([\s-_]\w+)*$/, Re = he(Ae(function() {
  return D([k(), N(), b(), Re]);
})), F = T({
  title: k().regex(Ze).max(40).optional(),
  required: b().optional(),
  description: k().optional(),
  defaultValue: D([k(), b(), N(), Re]).optional(),
  format: k().optional(),
  isValueField: b().optional()
}), ht = N().int().positive().lte(12).gte(1), je = U(F, T({
  type: B("string"),
  minLength: N().optional(),
  maxLength: N().optional()
})), Ie = U(F, T({
  type: B("string"),
  enum: te(k().nonempty()),
  showAsRadio: b().optional(),
  verticalLayout: b().optional()
})), Ee = U(F, T({
  type: B("number"),
  minimum: N().optional(),
  maximum: N().optional()
})), $e = U(F, T({
  type: B("integer"),
  minimum: N().optional(),
  maximum: N().optional()
})), Ve = U(F, T({
  type: B("boolean")
})), Le = U(F, T({
  type: B("object"),
  properties: Ae(function() {
    return he(D([
      Ie,
      je,
      Ee,
      $e,
      Ve,
      Le
    ]));
  }).optional()
})), ft = D([
  Ie,
  je,
  Ee,
  $e,
  Ve,
  Le
]), mt = T({
  staticProperties: te(k()).optional(),
  canvasRestrictions: T({
    hideInToolbar: b().optional(),
    minSize: ht.optional(),
    isFullRow: b().optional()
  }).optional()
}), pt = T({
  version: k().nonempty(),
  fallbackDisableSubmit: b(),
  controlName: k().nonempty().regex(Ze).max(40),
  pluginAuthor: k().optional(),
  pluginVersion: k().optional(),
  searchTerms: te(k()).optional(),
  description: k().optional(),
  groupName: D([
    k(),
    T({
      name: k(),
      order: N()
    })
  ]).optional(),
  iconUrl: k().optional(),
  designer: mt.optional(),
  properties: he(k().regex(lt), D([ft, b()])).optional(),
  standardProperties: T({
    fieldLabel: b().optional(),
    toolTip: b().optional(),
    description: b().optional(),
    placeholder: b().optional(),
    defaultValue: b().optional(),
    visibility: b().optional(),
    readOnly: b().optional(),
    required: b().optional()
  }).optional(),
  events: te(k()).optional()
}).strict();
class yt extends HTMLElement {
  static async getMetaConfig() {
    const e = {
      version: "1",
      controlName: "Central Table Grid",
      fallbackDisableSubmit: !1,
      properties: {
        value: {
          type: "object",
          title: "Value",
          isValueField: !0,
          defaultValue: {}
        }
      }
    };
    return pt.parse(e), e;
  }
  connectedCallback() {
    this.attachShadow({ mode: "open" }), this.shadowRoot.innerHTML = `
      <div style="padding:8px;border:1px solid #ddd;border-radius:6px;">
        Central Table Grid Loaded ✅
      </div>
    `;
  }
}
customElements.define("central-table-grid", yt);
