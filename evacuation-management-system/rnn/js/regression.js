var jsregression = jsregression || {};
! function (t) {
    "use strict";
    var s = function (t) {
        (t = t || {}).iterations || (t.iterations = 1e3), t.alpha || (t.alpha = .001), t.lambda || (t.lambda = 0), t.trace || (t.trace = !1), this.iterations = t.iterations, this.alpha = t.alpha, this.lambda = t.lambda, this.trace = t.trace
    };
    s.prototype.fit = function (t) {
        var s = t.length,
            a = [],
            i = [];
        this.dim = t[0].length;
        for (var h = 0; h < s; ++h) {
            var r = t[h],
                o = [],
                e = r[r.length - 1];
            o.push(1);
            for (var n = 0; n < r.length - 1; ++n) o.push(r[n]);
            i.push(e), a.push(o)
        }
        this.theta = [];
        for (f = 0; f < this.dim; ++f) this.theta.push(0);
        for (var l = 0; l < this.iterations; ++l) {
            for (var p = this.grad(a, i, this.theta), f = 0; f < this.dim; ++f) this.theta[f] = this.theta[f] - this.alpha * p[f];
            this.trace && console.log("cost at iteration " + l + ": " + this.cost(a, i, this.theta))
        }
        return {
            theta: this.theta,
            dim: this.dim,
            cost: this.cost(a, i, this.theta),
            config: {
                alpha: this.alpha,
                lambda: this.lambda,
                iterations: this.iterations
            }
        }
    }, s.prototype.grad = function (t, s, a) {
        for (var i = t.length, h = [], r = 0; r < this.dim; ++r) {
            for (var o = 0, e = 0; e < i; ++e) {
                var n = t[e],
                    l = s[e];
                o += (this.h(n, a) - l) * n[r]
            }
            o = (o + this.lambda * a[r]) / i, h.push(o)
        }
        return h
    }, s.prototype.h = function (t, s) {
        for (var a = 0, i = 0; i < this.dim; ++i) a += t[i] * s[i];
        return a
    }, s.prototype.cost = function (t, s, a) {
        for (var i = t.length, h = 0, r = 0; r < i; ++r) {
            var o = t[r],
                e = this.h(o, a);
            h += (e - s[r]) * (e - s[r])
        }
        for (var n = 0; n < this.dim; ++n) h += this.lambda * a[n] * a[n];
        return h / (2 * i)
    }, s.prototype.transform = function (t) {
        if (t[0].length) {
            for (var s = [], a = 0; a < t.length; ++a) {
                var i = this.transform(t[a]);
                s.push(i)
            }
            return s
        }
        var h = [];
        h.push(1);
        for (var r = 0; r < t.length; ++r) h.push(t[r]);
        return this.h(h, this.theta)
    }, t.LinearRegression = s;
    var a = function (t) {
        (t = t || {}).alpha || (t.alpha = .001), t.iterations || (t.iterations = 100), t.lambda || (t.lambda = 0), this.alpha = t.alpha, this.lambda = t.lambda, this.iterations = t.iterations
    };
    a.prototype.fit = function (t) {
        this.dim = t[0].length;
        for (var s = t.length, a = [], i = [], h = 0; h < s; ++h) {
            var r = t[h],
                o = [],
                e = r[r.length - 1];
            o.push(1);
            for (var n = 0; n < r.length - 1; ++n) o.push(r[n]);
            a.push(o), i.push(e)
        }
        this.theta = [];
        for (f = 0; f < this.dim; ++f) this.theta.push(0);
        for (var l = 0; l < this.iterations; ++l)
            for (var p = this.grad(a, i, this.theta), f = 0; f < this.dim; ++f) this.theta[f] = this.theta[f] - this.alpha * p[f];
        return this.threshold = this.computeThreshold(a, i), {
            theta: this.theta,
            threshold: this.threshold,
            cost: this.cost(a, i, this.theta),
            config: {
                alpha: this.alpha,
                lambda: this.lambda,
                iterations: this.iterations
            }
        }
    }, a.prototype.computeThreshold = function (t, s) {
        for (var a = 1, i = t.length, h = 0; h < i; ++h) {
            var r = this.transform(t[h]);
            1 == s[h] && a > r && (a = r)
        }
        return a
    }, a.prototype.grad = function (t, s, a) {
        for (var i = t.length, h = [], r = 0; r < this.dim; ++r) {
            for (var o = 0, e = 0; e < i; ++e) {
                var n = t[e];
                o += ((this.h(n, a) - s[e]) * n[r] + this.lambda * a[r]) / i
            }
            h.push(o)
        }
        return h
    }, a.prototype.h = function (t, s) {
        for (var a = 0, i = 0; i < this.dim; ++i) a += s[i] * t[i];
        return 1 / (1 + Math.exp(-a))
    }, a.prototype.transform = function (t) {
        if (t[0].length) {
            for (var s = [], a = 0; a < t.length; ++a) {
                var i = this.transform(t[a]);
                s.push(i)
            }
            return s
        }
        var h = [];
        h.push(1);
        for (var r = 0; r < t.length; ++r) h.push(t[r]);
        return this.h(h, this.theta)
    }, a.prototype.cost = function (t, s, a) {
        for (var i = t.length, h = 0, r = 0; r < i; ++r) {
            var o = s[r],
                e = t[r];
            h += -(o * Math.log(this.h(e, a)) + (1 - o) * Math.log(1 - this.h(e, a))) / i
        }
        for (var n = 0; n < this.dim; ++n) h += this.lambda * a[n] * a[n] / (2 * i);
        return h
    }, t.LogisticRegression = a;

    var i = function (t) {
        (t = t || {}).alpha || (t.alpha = .001), t.iterations || (t.iterations = 100), t.lambda || (t.lambda = 0), this.alpha = t.alpha, this.lambda = t.lambda, this.iterations = t.iterations
    };
    i.prototype.fit = function (s, a) {
        this.dim = s[0].length;
        var i = s.length;
        if (!a) {
            a = [];
            for (f = 0; f < i; ++f) {
                for (var h = !1, r = s[f][this.dim - 1], o = 0; o < a.length; ++o)
                    if (r == a[o]) {
                        h = !0;
                        break
                    }
                h || a.push(r)
            }
        }
        this.classes = a, this.logistics = {};
        for (var e = {}, n = 0; n < this.classes.length; ++n) {
            var l = this.classes[n];
            this.logistics[l] = new t.LogisticRegression({
                alpha: this.alpha,
                lambda: this.lambda,
                iterations: this.iterations
            });
            for (var p = [], f = 0; f < i; ++f) {
                for (var u = [], o = 0; o < this.dim - 1; ++o) u.push(s[f][o]);
                u.push(s[f][this.dim - 1] == l ? 1 : 0), p.push(u)
            }
            e[l] = this.logistics[l].fit(p)
        }
        return e
    }, i.prototype.transform = function (t) {
        if (t[0].length) {
            for (var s = [], a = 0; a < t.length; ++a) {
                var i = this.transform(t[a]);
                s.push(i)
            }
            return s
        }
        var forecast = []
        var class_data = {class: "", data: 0}

        for (var h = 0, r = "", o = 0; o < this.classes.length; ++o) {
            var e = this.classes[o],
                n = this.logistics[e].transform(t);
            class_data = {class: e, data: n}
            forecast.push(class_data)
            h < n && (h = n, r = e)
        }
        //forecast.winner = {class: r, data: h} 
        return forecast
    }, t.MultiClassLogistic = i
    
}(jsregression);
var module = module || {};
module && (module.exports = jsregression);