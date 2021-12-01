function tree_add(d) {
    const x = +this._x.call(null, d), y = +this._y.call(null, d);
    return add(this.cover(x, y), x, y, d);
}
function add(tree, x, y, d) {
    if (isNaN(x) || isNaN(y)) return tree;
    var parent, node = tree._root, leaf = {
        data: d
    }, x0 = tree._x0, y0 = tree._y0, x1 = tree._x1, y1 = tree._y1, xm, ym, xp, yp, right, bottom, i, j;
    if (!node) return tree._root = leaf, tree;
    while(node.length){
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm;
        else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym;
        else y1 = ym;
        if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
    }
    xp = +tree._x.call(null, node.data);
    yp = +tree._y.call(null, node.data);
    if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;
    do {
        parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm;
        else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym;
        else y1 = ym;
    }while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | xp >= xm))
    return parent[j] = node, parent[i] = leaf, tree;
}
function addAll(data) {
    var d, i, n = data.length, x, y, xz = new Array(n), yz = new Array(n), x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for(i = 0; i < n; ++i){
        if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
        xz[i] = x;
        yz[i] = y;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
    }
    if (x0 > x1 || y0 > y1) return this;
    this.cover(x0, y0).cover(x1, y1);
    for(i = 0; i < n; ++i){
        add(this, xz[i], yz[i], data[i]);
    }
    return this;
}
function tree_cover(x, y) {
    if (isNaN(x = +x) || isNaN(y = +y)) return this;
    var x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1;
    if (isNaN(x0)) {
        x1 = (x0 = Math.floor(x)) + 1;
        y1 = (y0 = Math.floor(y)) + 1;
    } else {
        var z = x1 - x0 || 1, node = this._root, parent, i;
        while(x0 > x || x >= x1 || y0 > y || y >= y1){
            i = (y < y0) << 1 | x < x0;
            parent = new Array(4), parent[i] = node, node = parent, z *= 2;
            switch(i){
                case 0:
                    x1 = x0 + z, y1 = y0 + z;
                    break;
                case 1:
                    x0 = x1 - z, y1 = y0 + z;
                    break;
                case 2:
                    x1 = x0 + z, y0 = y1 - z;
                    break;
                case 3:
                    x0 = x1 - z, y0 = y1 - z;
                    break;
            }
        }
        if (this._root && this._root.length) this._root = node;
    }
    this._x0 = x0;
    this._y0 = y0;
    this._x1 = x1;
    this._y1 = y1;
    return this;
}
function tree_data() {
    var data = [];
    this.visit(function(node) {
        if (!node.length) do data.push(node.data);
        while (node = node.next)
    });
    return data;
}
function tree_extent(_) {
    return arguments.length ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1]) : isNaN(this._x0) ? void 0 : [
        [
            this._x0,
            this._y0
        ],
        [
            this._x1,
            this._y1
        ]
    ];
}
function Quad(node, x0, y0, x1, y1) {
    this.node = node;
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
}
function tree_find(x, y, radius) {
    var data, x0 = this._x0, y0 = this._y0, x1, y1, x2, y2, x3 = this._x1, y3 = this._y1, quads = [], node = this._root, q, i;
    if (node) quads.push(new Quad(node, x0, y0, x3, y3));
    if (radius == null) radius = Infinity;
    else {
        x0 = x - radius, y0 = y - radius;
        x3 = x + radius, y3 = y + radius;
        radius *= radius;
    }
    while(q = quads.pop()){
        if (!(node = q.node) || (x1 = q.x0) > x3 || (y1 = q.y0) > y3 || (x2 = q.x1) < x0 || (y2 = q.y1) < y0) continue;
        if (node.length) {
            var xm = (x1 + x2) / 2, ym = (y1 + y2) / 2;
            quads.push(new Quad(node[3], xm, ym, x2, y2), new Quad(node[2], x1, ym, xm, y2), new Quad(node[1], xm, y1, x2, ym), new Quad(node[0], x1, y1, xm, ym));
            if (i = (y >= ym) << 1 | x >= xm) {
                q = quads[quads.length - 1];
                quads[quads.length - 1] = quads[quads.length - 1 - i];
                quads[quads.length - 1 - i] = q;
            }
        } else {
            var dx = x - +this._x.call(null, node.data), dy = y - +this._y.call(null, node.data), d2 = dx * dx + dy * dy;
            if (d2 < radius) {
                var d = Math.sqrt(radius = d2);
                x0 = x - d, y0 = y - d;
                x3 = x + d, y3 = y + d;
                data = node.data;
            }
        }
    }
    return data;
}
function tree_remove(d) {
    if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this;
    var parent, node = this._root, retainer, previous, next, x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1, x, y, xm, ym, right, bottom, i, j;
    if (!node) return this;
    if (node.length) while(true){
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm;
        else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym;
        else y1 = ym;
        if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
        if (!node.length) break;
        if (parent[i + 1 & 3] || parent[i + 2 & 3] || parent[i + 3 & 3]) retainer = parent, j = i;
    }
    while(node.data !== d)if (!(previous = node, node = node.next)) return this;
    if (next = node.next) delete node.next;
    if (previous) return next ? previous.next = next : delete previous.next, this;
    if (!parent) return this._root = next, this;
    next ? parent[i] = next : delete parent[i];
    if ((node = parent[0] || parent[1] || parent[2] || parent[3]) && node === (parent[3] || parent[2] || parent[1] || parent[0]) && !node.length) {
        if (retainer) retainer[j] = node;
        else this._root = node;
    }
    return this;
}
function removeAll(data) {
    for(var i = 0, n = data.length; i < n; ++i)this.remove(data[i]);
    return this;
}
function tree_root() {
    return this._root;
}
function tree_size() {
    var size = 0;
    this.visit(function(node) {
        if (!node.length) do ++size;
        while (node = node.next)
    });
    return size;
}
function tree_visit(callback) {
    var quads = [], q, node = this._root, child, x0, y0, x1, y1;
    if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
    while(q = quads.pop()){
        if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
            var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
            if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
            if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
            if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
            if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
        }
    }
    return this;
}
function tree_visitAfter(callback) {
    var quads = [], next = [], q;
    if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
    while(q = quads.pop()){
        var node = q.node;
        if (node.length) {
            var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
            if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
            if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
            if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
            if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
        }
        next.push(q);
    }
    while(q = next.pop()){
        callback(q.node, q.x0, q.y0, q.x1, q.y1);
    }
    return this;
}
function defaultX(d) {
    return d[0];
}
function tree_x(_) {
    return arguments.length ? (this._x = _, this) : this._x;
}
function defaultY(d) {
    return d[1];
}
function tree_y(_) {
    return arguments.length ? (this._y = _, this) : this._y;
}
function quadtree(nodes, x, y) {
    var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
    return nodes == null ? tree : tree.addAll(nodes);
}
function Quadtree(x, y, x0, y0, x1, y1) {
    this._x = x;
    this._y = y;
    this._x0 = x0;
    this._y0 = y0;
    this._x1 = x1;
    this._y1 = y1;
    this._root = void 0;
}
function leaf_copy(leaf) {
    var copy = {
        data: leaf.data
    }, next = copy;
    while(leaf = leaf.next)next = next.next = {
        data: leaf.data
    };
    return copy;
}
var treeProto = quadtree.prototype = Quadtree.prototype;
treeProto.copy = function() {
    var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1), node = this._root, nodes, child;
    if (!node) return copy;
    if (!node.length) return copy._root = leaf_copy(node), copy;
    nodes = [
        {
            source: node,
            target: copy._root = new Array(4)
        }
    ];
    while(node = nodes.pop()){
        for(var i = 0; i < 4; ++i){
            if (child = node.source[i]) {
                if (child.length) nodes.push({
                    source: child,
                    target: node.target[i] = new Array(4)
                });
                else node.target[i] = leaf_copy(child);
            }
        }
    }
    return copy;
};
treeProto.add = tree_add;
treeProto.addAll = addAll;
treeProto.cover = tree_cover;
treeProto.data = tree_data;
treeProto.extent = tree_extent;
treeProto.find = tree_find;
treeProto.remove = tree_remove;
treeProto.removeAll = removeAll;
treeProto.root = tree_root;
treeProto.size = tree_size;
treeProto.visit = tree_visit;
treeProto.visitAfter = tree_visitAfter;
treeProto.x = tree_x;
treeProto.y = tree_y;
var noop = {
    value: ()=>{
    }
};
function dispatch() {
    for(var i = 0, n = arguments.length, _ = {
    }, t; i < n; ++i){
        if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
        _[t] = [];
    }
    return new Dispatch(_);
}
function Dispatch(_) {
    this._ = _;
}
function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
        return {
            type: t,
            name
        };
    });
}
Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
        var _ = this._, T = parseTypenames(typename + "", _), t, i = -1, n = T.length;
        if (arguments.length < 2) {
            while(++i < n)if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
            return;
        }
        if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
        while(++i < n){
            if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
            else if (callback == null) for(t in _)_[t] = set(_[t], typename.name, null);
        }
        return this;
    },
    copy: function() {
        var copy = {
        }, _ = this._;
        for(var t in _)copy[t] = _[t].slice();
        return new Dispatch(copy);
    },
    call: function(type, that) {
        if ((n = arguments.length - 2) > 0) for(var args = new Array(n), i = 0, n, t; i < n; ++i)args[i] = arguments[i + 2];
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for(t = this._[type], i = 0, n = t.length; i < n; ++i)t[i].value.apply(that, args);
    },
    apply: function(type, that, args) {
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for(var t = this._[type], i = 0, n = t.length; i < n; ++i)t[i].value.apply(that, args);
    }
};
function get(type, name) {
    for(var i = 0, n = type.length, c; i < n; ++i){
        if ((c = type[i]).name === name) {
            return c.value;
        }
    }
}
function set(type, name, callback) {
    for(var i = 0, n = type.length; i < n; ++i){
        if (type[i].name === name) {
            type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
            break;
        }
    }
    if (callback != null) type.push({
        name,
        value: callback
    });
    return type;
}
var frame = 0, timeout = 0, interval = 0, pokeDelay = 1000, taskHead, taskTail, clockLast = 0, clockNow = 0, clockSkew = 0, clock = typeof performance === "object" && performance.now ? performance : Date, setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
    setTimeout(f, 17);
};
function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}
function clearNow() {
    clockNow = 0;
}
function Timer() {
    this._call = this._time = this._next = null;
}
Timer.prototype = timer.prototype = {
    constructor: Timer,
    restart: function(callback, delay, time) {
        if (typeof callback !== "function") throw new TypeError("callback is not a function");
        time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
        if (!this._next && taskTail !== this) {
            if (taskTail) taskTail._next = this;
            else taskHead = this;
            taskTail = this;
        }
        this._call = callback;
        this._time = time;
        sleep();
    },
    stop: function() {
        if (this._call) {
            this._call = null;
            this._time = Infinity;
            sleep();
        }
    }
};
function timer(callback, delay, time) {
    var t = new Timer();
    t.restart(callback, delay, time);
    return t;
}
function timerFlush() {
    now();
    ++frame;
    var t = taskHead, e;
    while(t){
        if ((e = clockNow - t._time) >= 0) t._call.call(void 0, e);
        t = t._next;
    }
    --frame;
}
function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout = 0;
    try {
        timerFlush();
    } finally{
        frame = 0;
        nap();
        clockNow = 0;
    }
}
function poke() {
    var now2 = clock.now(), delay = now2 - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now2;
}
function nap() {
    var t0, t1 = taskHead, t2, time = Infinity;
    while(t1){
        if (t1._call) {
            if (time > t1._time) time = t1._time;
            t0 = t1, t1 = t1._next;
        } else {
            t2 = t1._next, t1._next = null;
            t1 = t0 ? t0._next = t2 : taskHead = t2;
        }
    }
    taskTail = t0;
    sleep(time);
}
function sleep(time) {
    if (frame) return;
    if (timeout) timeout = clearTimeout(timeout);
    var delay = time - clockNow;
    if (delay > 24) {
        if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
        if (interval) interval = clearInterval(interval);
    } else {
        if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
        frame = 1, setFrame(wake);
    }
}
function timeout$1(callback, delay, time) {
    var t = new Timer();
    delay = delay == null ? 0 : +delay;
    t.restart((elapsed)=>{
        t.stop();
        callback(elapsed + delay);
    }, delay, time);
    return t;
}
function constant(x2) {
    return function() {
        return x2;
    };
}
function jiggle(random) {
    return (random() - 0.5) * 0.000001;
}
function x(d) {
    return d.x + d.vx;
}
function y(d) {
    return d.y + d.vy;
}
function collide(radius) {
    var nodes, radii, random, strength = 1, iterations = 1;
    if (typeof radius !== "function") radius = constant(radius == null ? 1 : +radius);
    function force() {
        var i, n = nodes.length, tree, node, xi, yi, ri, ri2;
        for(var k = 0; k < iterations; ++k){
            tree = quadtree(nodes, x, y).visitAfter(prepare);
            for(i = 0; i < n; ++i){
                node = nodes[i];
                ri = radii[node.index], ri2 = ri * ri;
                xi = node.x + node.vx;
                yi = node.y + node.vy;
                tree.visit(apply);
            }
        }
        function apply(quad, x0, y0, x1, y1) {
            var data = quad.data, rj = quad.r, r = ri + rj;
            if (data) {
                if (data.index > node.index) {
                    var x2 = xi - data.x - data.vx, y2 = yi - data.y - data.vy, l = x2 * x2 + y2 * y2;
                    if (l < r * r) {
                        if (x2 === 0) x2 = jiggle(random), l += x2 * x2;
                        if (y2 === 0) y2 = jiggle(random), l += y2 * y2;
                        l = (r - (l = Math.sqrt(l))) / l * strength;
                        node.vx += (x2 *= l) * (r = (rj *= rj) / (ri2 + rj));
                        node.vy += (y2 *= l) * r;
                        data.vx -= x2 * (r = 1 - r);
                        data.vy -= y2 * r;
                    }
                }
                return;
            }
            return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
        }
    }
    function prepare(quad) {
        if (quad.data) return quad.r = radii[quad.data.index];
        for(var i = quad.r = 0; i < 4; ++i){
            if (quad[i] && quad[i].r > quad.r) {
                quad.r = quad[i].r;
            }
        }
    }
    function initialize() {
        if (!nodes) return;
        var i, n = nodes.length, node;
        radii = new Array(n);
        for(i = 0; i < n; ++i)node = nodes[i], radii[node.index] = +radius(node, i, nodes);
    }
    force.initialize = function(_nodes, _random) {
        nodes = _nodes;
        random = _random;
        initialize();
    };
    force.iterations = function(_) {
        return arguments.length ? (iterations = +_, force) : iterations;
    };
    force.strength = function(_) {
        return arguments.length ? (strength = +_, force) : strength;
    };
    force.radius = function(_) {
        return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), initialize(), force) : radius;
    };
    return force;
}
function index(d) {
    return d.index;
}
function find(nodeById, nodeId) {
    var node = nodeById.get(nodeId);
    if (!node) throw new Error("node not found: " + nodeId);
    return node;
}
function link(links) {
    var id = index, strength = defaultStrength, strengths, distance = constant(30), distances, nodes, count, bias, random, iterations = 1;
    if (links == null) links = [];
    function defaultStrength(link2) {
        return 1 / Math.min(count[link2.source.index], count[link2.target.index]);
    }
    function force(alpha) {
        for(var k = 0, n = links.length; k < iterations; ++k){
            for(var i = 0, link2, source, target, x2, y2, l, b; i < n; ++i){
                link2 = links[i], source = link2.source, target = link2.target;
                x2 = target.x + target.vx - source.x - source.vx || jiggle(random);
                y2 = target.y + target.vy - source.y - source.vy || jiggle(random);
                l = Math.sqrt(x2 * x2 + y2 * y2);
                l = (l - distances[i]) / l * alpha * strengths[i];
                x2 *= l, y2 *= l;
                target.vx -= x2 * (b = bias[i]);
                target.vy -= y2 * b;
                source.vx += x2 * (b = 1 - b);
                source.vy += y2 * b;
            }
        }
    }
    function initialize() {
        if (!nodes) return;
        var i, n = nodes.length, m2 = links.length, nodeById = new Map(nodes.map((d, i2)=>[
                id(d, i2, nodes),
                d
            ]
        )), link2;
        for(i = 0, count = new Array(n); i < m2; ++i){
            link2 = links[i], link2.index = i;
            if (typeof link2.source !== "object") link2.source = find(nodeById, link2.source);
            if (typeof link2.target !== "object") link2.target = find(nodeById, link2.target);
            count[link2.source.index] = (count[link2.source.index] || 0) + 1;
            count[link2.target.index] = (count[link2.target.index] || 0) + 1;
        }
        for(i = 0, bias = new Array(m2); i < m2; ++i){
            link2 = links[i], bias[i] = count[link2.source.index] / (count[link2.source.index] + count[link2.target.index]);
        }
        strengths = new Array(m2), initializeStrength();
        distances = new Array(m2), initializeDistance();
    }
    function initializeStrength() {
        if (!nodes) return;
        for(var i = 0, n = links.length; i < n; ++i){
            strengths[i] = +strength(links[i], i, links);
        }
    }
    function initializeDistance() {
        if (!nodes) return;
        for(var i = 0, n = links.length; i < n; ++i){
            distances[i] = +distance(links[i], i, links);
        }
    }
    force.initialize = function(_nodes, _random) {
        nodes = _nodes;
        random = _random;
        initialize();
    };
    force.links = function(_) {
        return arguments.length ? (links = _, initialize(), force) : links;
    };
    force.id = function(_) {
        return arguments.length ? (id = _, force) : id;
    };
    force.iterations = function(_) {
        return arguments.length ? (iterations = +_, force) : iterations;
    };
    force.strength = function(_) {
        return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initializeStrength(), force) : strength;
    };
    force.distance = function(_) {
        return arguments.length ? (distance = typeof _ === "function" ? _ : constant(+_), initializeDistance(), force) : distance;
    };
    return force;
}
const a = 1664525;
const c = 1013904223;
const m = 4294967296;
function lcg() {
    let s = 1;
    return ()=>(s = (a * s + c) % m) / 4294967296
    ;
}
var initialRadius = 10, initialAngle = Math.PI * (3 - Math.sqrt(5));
function simulation(nodes) {
    var simulation2, alpha = 1, alphaMin = 0.001, alphaDecay = 1 - Math.pow(alphaMin, 1 / 300), alphaTarget = 0, velocityDecay = 0.6, forces = new Map(), stepper = timer(step), event = dispatch("tick", "end"), random = lcg();
    if (nodes == null) nodes = [];
    function step() {
        tick();
        event.call("tick", simulation2);
        if (alpha < alphaMin) {
            stepper.stop();
            event.call("end", simulation2);
        }
    }
    function tick(iterations) {
        var i, n = nodes.length, node;
        if (iterations === void 0) iterations = 1;
        for(var k = 0; k < iterations; ++k){
            alpha += (alphaTarget - alpha) * alphaDecay;
            forces.forEach(function(force) {
                force(alpha);
            });
            for(i = 0; i < n; ++i){
                node = nodes[i];
                if (node.fx == null) node.x += node.vx *= velocityDecay;
                else node.x = node.fx, node.vx = 0;
                if (node.fy == null) node.y += node.vy *= velocityDecay;
                else node.y = node.fy, node.vy = 0;
            }
        }
        return simulation2;
    }
    function initializeNodes() {
        for(var i = 0, n = nodes.length, node; i < n; ++i){
            node = nodes[i], node.index = i;
            if (node.fx != null) node.x = node.fx;
            if (node.fy != null) node.y = node.fy;
            if (isNaN(node.x) || isNaN(node.y)) {
                var radius = initialRadius * Math.sqrt(0.5 + i), angle = i * initialAngle;
                node.x = radius * Math.cos(angle);
                node.y = radius * Math.sin(angle);
            }
            if (isNaN(node.vx) || isNaN(node.vy)) {
                node.vx = node.vy = 0;
            }
        }
    }
    function initializeForce(force) {
        if (force.initialize) force.initialize(nodes, random);
        return force;
    }
    initializeNodes();
    return simulation2 = {
        tick,
        restart: function() {
            return stepper.restart(step), simulation2;
        },
        stop: function() {
            return stepper.stop(), simulation2;
        },
        nodes: function(_) {
            return arguments.length ? (nodes = _, initializeNodes(), forces.forEach(initializeForce), simulation2) : nodes;
        },
        alpha: function(_) {
            return arguments.length ? (alpha = +_, simulation2) : alpha;
        },
        alphaMin: function(_) {
            return arguments.length ? (alphaMin = +_, simulation2) : alphaMin;
        },
        alphaDecay: function(_) {
            return arguments.length ? (alphaDecay = +_, simulation2) : +alphaDecay;
        },
        alphaTarget: function(_) {
            return arguments.length ? (alphaTarget = +_, simulation2) : alphaTarget;
        },
        velocityDecay: function(_) {
            return arguments.length ? (velocityDecay = 1 - _, simulation2) : 1 - velocityDecay;
        },
        randomSource: function(_) {
            return arguments.length ? (random = _, forces.forEach(initializeForce), simulation2) : random;
        },
        force: function(name, _) {
            return arguments.length > 1 ? (_ == null ? forces.delete(name) : forces.set(name, initializeForce(_)), simulation2) : forces.get(name);
        },
        find: function(x2, y2, radius) {
            var i = 0, n = nodes.length, dx, dy, d2, node, closest;
            if (radius == null) radius = Infinity;
            else radius *= radius;
            for(i = 0; i < n; ++i){
                node = nodes[i];
                dx = x2 - node.x;
                dy = y2 - node.y;
                d2 = dx * dx + dy * dy;
                if (d2 < radius) closest = node, radius = d2;
            }
            return closest;
        },
        on: function(name, _) {
            return arguments.length > 1 ? (event.on(name, _), simulation2) : event.on(name);
        }
    };
}
function x$2(x2) {
    var strength = constant(0.1), nodes, strengths, xz;
    if (typeof x2 !== "function") x2 = constant(x2 == null ? 0 : +x2);
    function force(alpha) {
        for(var i = 0, n = nodes.length, node; i < n; ++i){
            node = nodes[i], node.vx += (xz[i] - node.x) * strengths[i] * alpha;
        }
    }
    function initialize() {
        if (!nodes) return;
        var i, n = nodes.length;
        strengths = new Array(n);
        xz = new Array(n);
        for(i = 0; i < n; ++i){
            strengths[i] = isNaN(xz[i] = +x2(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
        }
    }
    force.initialize = function(_) {
        nodes = _;
        initialize();
    };
    force.strength = function(_) {
        return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
    };
    force.x = function(_) {
        return arguments.length ? (x2 = typeof _ === "function" ? _ : constant(+_), initialize(), force) : x2;
    };
    return force;
}
function y$2(y2) {
    var strength = constant(0.1), nodes, strengths, yz;
    if (typeof y2 !== "function") y2 = constant(y2 == null ? 0 : +y2);
    function force(alpha) {
        for(var i = 0, n = nodes.length, node; i < n; ++i){
            node = nodes[i], node.vy += (yz[i] - node.y) * strengths[i] * alpha;
        }
    }
    function initialize() {
        if (!nodes) return;
        var i, n = nodes.length;
        strengths = new Array(n);
        yz = new Array(n);
        for(i = 0; i < n; ++i){
            strengths[i] = isNaN(yz[i] = +y2(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
        }
    }
    force.initialize = function(_) {
        nodes = _;
        initialize();
    };
    force.strength = function(_) {
        return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
    };
    force.y = function(_) {
        return arguments.length ? (y2 = typeof _ === "function" ? _ : constant(+_), initialize(), force) : y2;
    };
    return force;
}
var xhtml = "http://www.w3.org/1999/xhtml";
var namespaces = {
    svg: "http://www.w3.org/2000/svg",
    xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
};
function namespace(name) {
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces.hasOwnProperty(prefix) ? {
        space: namespaces[prefix],
        local: name
    } : name;
}
function creatorInherit(name) {
    return function() {
        var document2 = this.ownerDocument, uri = this.namespaceURI;
        return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name) : document2.createElementNS(uri, name);
    };
}
function creatorFixed(fullname) {
    return function() {
        return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
}
function creator(name) {
    var fullname = namespace(name);
    return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}
function none() {
}
function selector(selector2) {
    return selector2 == null ? none : function() {
        return this.querySelector(selector2);
    };
}
function selection_select(select2) {
    if (typeof select2 !== "function") select2 = selector(select2);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i){
            if ((node = group[i]) && (subnode = select2.call(node, node.__data__, i, group))) {
                if ("__data__" in node) subnode.__data__ = node.__data__;
                subgroup[i] = subnode;
            }
        }
    }
    return new Selection(subgroups, this._parents);
}
function array(x) {
    return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
}
function empty() {
    return [];
}
function selectorAll(selector2) {
    return selector2 == null ? empty : function() {
        return this.querySelectorAll(selector2);
    };
}
function arrayAll(select2) {
    return function() {
        return array(select2.apply(this, arguments));
    };
}
function selection_selectAll(select2) {
    if (typeof select2 === "function") select2 = arrayAll(select2);
    else select2 = selectorAll(select2);
    for(var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
            if (node = group[i]) {
                subgroups.push(select2.call(node, node.__data__, i, group));
                parents.push(node);
            }
        }
    }
    return new Selection(subgroups, parents);
}
function matcher(selector2) {
    return function() {
        return this.matches(selector2);
    };
}
function childMatcher(selector2) {
    return function(node) {
        return node.matches(selector2);
    };
}
var find1 = Array.prototype.find;
function childFind(match) {
    return function() {
        return find1.call(this.children, match);
    };
}
function childFirst() {
    return this.firstElementChild;
}
function selection_selectChild(match) {
    return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
}
var filter = Array.prototype.filter;
function children() {
    return Array.from(this.children);
}
function childrenFilter(match) {
    return function() {
        return filter.call(this.children, match);
    };
}
function selection_selectChildren(match) {
    return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}
function selection_filter(match) {
    if (typeof match !== "function") match = matcher(match);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i){
            if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
                subgroup.push(node);
            }
        }
    }
    return new Selection(subgroups, this._parents);
}
function sparse(update) {
    return new Array(update.length);
}
function selection_enter() {
    return new Selection(this._enter || this._groups.map(sparse), this._parents);
}
function EnterNode(parent, datum2) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum2;
}
EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) {
        return this._parent.insertBefore(child, this._next);
    },
    insertBefore: function(child, next) {
        return this._parent.insertBefore(child, next);
    },
    querySelector: function(selector2) {
        return this._parent.querySelector(selector2);
    },
    querySelectorAll: function(selector2) {
        return this._parent.querySelectorAll(selector2);
    }
};
function constant1(x) {
    return function() {
        return x;
    };
}
function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0, node, groupLength = group.length, dataLength = data.length;
    for(; i < dataLength; ++i){
        if (node = group[i]) {
            node.__data__ = data[i];
            update[i] = node;
        } else {
            enter[i] = new EnterNode(parent, data[i]);
        }
    }
    for(; i < groupLength; ++i){
        if (node = group[i]) {
            exit[i] = node;
        }
    }
}
function bindKey(parent, group, enter, update, exit, data, key) {
    var i, node, nodeByKeyValue = new Map(), groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
    for(i = 0; i < groupLength; ++i){
        if (node = group[i]) {
            keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
            if (nodeByKeyValue.has(keyValue)) {
                exit[i] = node;
            } else {
                nodeByKeyValue.set(keyValue, node);
            }
        }
    }
    for(i = 0; i < dataLength; ++i){
        keyValue = key.call(parent, data[i], i, data) + "";
        if (node = nodeByKeyValue.get(keyValue)) {
            update[i] = node;
            node.__data__ = data[i];
            nodeByKeyValue.delete(keyValue);
        } else {
            enter[i] = new EnterNode(parent, data[i]);
        }
    }
    for(i = 0; i < groupLength; ++i){
        if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) {
            exit[i] = node;
        }
    }
}
function datum(node) {
    return node.__data__;
}
function selection_data(value, key) {
    if (!arguments.length) return Array.from(this, datum);
    var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
    if (typeof value !== "function") value = constant1(value);
    for(var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j){
        var parent = parents[j], group = groups[j], groupLength = group.length, data = arraylike(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
        bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
        for(var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0){
            if (previous = enterGroup[i0]) {
                if (i0 >= i1) i1 = i0 + 1;
                while(!(next = updateGroup[i1]) && ++i1 < dataLength);
                previous._next = next || null;
            }
        }
    }
    update = new Selection(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
}
function arraylike(data) {
    return typeof data === "object" && "length" in data ? data : Array.from(data);
}
function selection_exit() {
    return new Selection(this._exit || this._groups.map(sparse), this._parents);
}
function selection_join(onenter, onupdate, onexit) {
    var enter = this.enter(), update = this, exit = this.exit();
    if (typeof onenter === "function") {
        enter = onenter(enter);
        if (enter) enter = enter.selection();
    } else {
        enter = enter.append(onenter + "");
    }
    if (onupdate != null) {
        update = onupdate(update);
        if (update) update = update.selection();
    }
    if (onexit == null) exit.remove();
    else onexit(exit);
    return enter && update ? enter.merge(update).order() : update;
}
function selection_merge(context) {
    var selection2 = context.selection ? context.selection() : context;
    for(var groups0 = this._groups, groups1 = selection2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j){
        for(var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i){
            if (node = group0[i] || group1[i]) {
                merge[i] = node;
            }
        }
    }
    for(; j < m0; ++j){
        merges[j] = groups0[j];
    }
    return new Selection(merges, this._parents);
}
function selection_order() {
    for(var groups = this._groups, j = -1, m = groups.length; ++j < m;){
        for(var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;){
            if (node = group[i]) {
                if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
                next = node;
            }
        }
    }
    return this;
}
function selection_sort(compare) {
    if (!compare) compare = ascending;
    function compareNode(a, b) {
        return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }
    for(var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i){
            if (node = group[i]) {
                sortgroup[i] = node;
            }
        }
        sortgroup.sort(compareNode);
    }
    return new Selection(sortgroups, this._parents).order();
}
function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
function selection_call() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
}
function selection_nodes() {
    return Array.from(this);
}
function selection_node() {
    for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j){
        for(var group = groups[j], i = 0, n = group.length; i < n; ++i){
            var node = group[i];
            if (node) return node;
        }
    }
    return null;
}
function selection_size() {
    let size = 0;
    for (const node of this)++size;
    return size;
}
function selection_empty() {
    return !this.node();
}
function selection_each(callback) {
    for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j){
        for(var group = groups[j], i = 0, n = group.length, node; i < n; ++i){
            if (node = group[i]) callback.call(node, node.__data__, i, group);
        }
    }
    return this;
}
function attrRemove(name) {
    return function() {
        this.removeAttribute(name);
    };
}
function attrRemoveNS(fullname) {
    return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
    };
}
function attrConstant(name, value) {
    return function() {
        this.setAttribute(name, value);
    };
}
function attrConstantNS(fullname, value) {
    return function() {
        this.setAttributeNS(fullname.space, fullname.local, value);
    };
}
function attrFunction(name, value) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttribute(name);
        else this.setAttribute(name, v);
    };
}
function attrFunctionNS(fullname, value) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
        else this.setAttributeNS(fullname.space, fullname.local, v);
    };
}
function selection_attr(name, value) {
    var fullname = namespace(name);
    if (arguments.length < 2) {
        var node = this.node();
        return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
    }
    return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
}
function defaultView(node) {
    return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
}
function styleRemove(name) {
    return function() {
        this.style.removeProperty(name);
    };
}
function styleConstant(name, value, priority) {
    return function() {
        this.style.setProperty(name, value, priority);
    };
}
function styleFunction(name, value, priority) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.style.removeProperty(name);
        else this.style.setProperty(name, v, priority);
    };
}
function selection_style(name, value, priority) {
    return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}
function styleValue(node, name) {
    return node.style.getPropertyValue(name) || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}
function propertyRemove(name) {
    return function() {
        delete this[name];
    };
}
function propertyConstant(name, value) {
    return function() {
        this[name] = value;
    };
}
function propertyFunction(name, value) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) delete this[name];
        else this[name] = v;
    };
}
function selection_property(name, value) {
    return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}
function classArray(string) {
    return string.trim().split(/^|\s+/);
}
function classList(node) {
    return node.classList || new ClassList(node);
}
function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
}
ClassList.prototype = {
    add: function(name) {
        var i = this._names.indexOf(name);
        if (i < 0) {
            this._names.push(name);
            this._node.setAttribute("class", this._names.join(" "));
        }
    },
    remove: function(name) {
        var i = this._names.indexOf(name);
        if (i >= 0) {
            this._names.splice(i, 1);
            this._node.setAttribute("class", this._names.join(" "));
        }
    },
    contains: function(name) {
        return this._names.indexOf(name) >= 0;
    }
};
function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while(++i < n)list.add(names[i]);
}
function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while(++i < n)list.remove(names[i]);
}
function classedTrue(names) {
    return function() {
        classedAdd(this, names);
    };
}
function classedFalse(names) {
    return function() {
        classedRemove(this, names);
    };
}
function classedFunction(names, value) {
    return function() {
        (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
}
function selection_classed(name, value) {
    var names = classArray(name + "");
    if (arguments.length < 2) {
        var list = classList(this.node()), i = -1, n = names.length;
        while(++i < n)if (!list.contains(names[i])) return false;
        return true;
    }
    return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}
function textRemove() {
    this.textContent = "";
}
function textConstant(value) {
    return function() {
        this.textContent = value;
    };
}
function textFunction(value) {
    return function() {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
    };
}
function selection_text(value) {
    return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
}
function htmlRemove() {
    this.innerHTML = "";
}
function htmlConstant(value) {
    return function() {
        this.innerHTML = value;
    };
}
function htmlFunction(value) {
    return function() {
        var v = value.apply(this, arguments);
        this.innerHTML = v == null ? "" : v;
    };
}
function selection_html(value) {
    return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}
function raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
}
function selection_raise() {
    return this.each(raise);
}
function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function selection_lower() {
    return this.each(lower);
}
function selection_append(name) {
    var create2 = typeof name === "function" ? name : creator(name);
    return this.select(function() {
        return this.appendChild(create2.apply(this, arguments));
    });
}
function constantNull() {
    return null;
}
function selection_insert(name, before) {
    var create2 = typeof name === "function" ? name : creator(name), select2 = before == null ? constantNull : typeof before === "function" ? before : selector(before);
    return this.select(function() {
        return this.insertBefore(create2.apply(this, arguments), select2.apply(this, arguments) || null);
    });
}
function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
}
function selection_remove() {
    return this.each(remove);
}
function selection_cloneShallow() {
    var clone = this.cloneNode(false), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_cloneDeep() {
    var clone = this.cloneNode(true), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_clone(deep) {
    return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}
function selection_datum(value) {
    return arguments.length ? this.property("__data__", value) : this.node().__data__;
}
function contextListener(listener) {
    return function(event) {
        listener.call(this, event, this.__data__);
    };
}
function parseTypenames1(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        return {
            type: t,
            name
        };
    });
}
function onRemove(typename) {
    return function() {
        var on = this.__on;
        if (!on) return;
        for(var j = 0, i = -1, m = on.length, o; j < m; ++j){
            if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
                this.removeEventListener(o.type, o.listener, o.options);
            } else {
                on[++i] = o;
            }
        }
        if (++i) on.length = i;
        else delete this.__on;
    };
}
function onAdd(typename, value, options) {
    return function() {
        var on = this.__on, o, listener = contextListener(value);
        if (on) for(var j = 0, m = on.length; j < m; ++j){
            if ((o = on[j]).type === typename.type && o.name === typename.name) {
                this.removeEventListener(o.type, o.listener, o.options);
                this.addEventListener(o.type, o.listener = listener, o.options = options);
                o.value = value;
                return;
            }
        }
        this.addEventListener(typename.type, listener, options);
        o = {
            type: typename.type,
            name: typename.name,
            value,
            listener,
            options
        };
        if (!on) this.__on = [
            o
        ];
        else on.push(o);
    };
}
function selection_on(typename, value, options) {
    var typenames = parseTypenames1(typename + ""), i, n = typenames.length, t;
    if (arguments.length < 2) {
        var on = this.node().__on;
        if (on) for(var j = 0, m = on.length, o; j < m; ++j){
            for(i = 0, o = on[j]; i < n; ++i){
                if ((t = typenames[i]).type === o.type && t.name === o.name) {
                    return o.value;
                }
            }
        }
        return;
    }
    on = value ? onAdd : onRemove;
    for(i = 0; i < n; ++i)this.each(on(typenames[i], value, options));
    return this;
}
function dispatchEvent(node, type, params) {
    var window = defaultView(node), event = window.CustomEvent;
    if (typeof event === "function") {
        event = new event(type, params);
    } else {
        event = window.document.createEvent("Event");
        if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
        else event.initEvent(type, false, false);
    }
    node.dispatchEvent(event);
}
function dispatchConstant(type, params) {
    return function() {
        return dispatchEvent(this, type, params);
    };
}
function dispatchFunction(type, params) {
    return function() {
        return dispatchEvent(this, type, params.apply(this, arguments));
    };
}
function selection_dispatch(type, params) {
    return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
}
function* selection_iterator() {
    for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j){
        for(var group = groups[j], i = 0, n = group.length, node; i < n; ++i){
            if (node = group[i]) yield node;
        }
    }
}
var root = [
    null
];
function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
}
function selection() {
    return new Selection([
        [
            document.documentElement
        ]
    ], root);
}
function selection_selection() {
    return this;
}
Selection.prototype = selection.prototype = {
    constructor: Selection,
    select: selection_select,
    selectAll: selection_selectAll,
    selectChild: selection_selectChild,
    selectChildren: selection_selectChildren,
    filter: selection_filter,
    data: selection_data,
    enter: selection_enter,
    exit: selection_exit,
    join: selection_join,
    merge: selection_merge,
    selection: selection_selection,
    order: selection_order,
    sort: selection_sort,
    call: selection_call,
    nodes: selection_nodes,
    node: selection_node,
    size: selection_size,
    empty: selection_empty,
    each: selection_each,
    attr: selection_attr,
    style: selection_style,
    property: selection_property,
    classed: selection_classed,
    text: selection_text,
    html: selection_html,
    raise: selection_raise,
    lower: selection_lower,
    append: selection_append,
    insert: selection_insert,
    remove: selection_remove,
    clone: selection_clone,
    datum: selection_datum,
    on: selection_on,
    dispatch: selection_dispatch,
    [Symbol.iterator]: selection_iterator
};
function select(selector2) {
    return typeof selector2 === "string" ? new Selection([
        [
            document.querySelector(selector2)
        ]
    ], [
        document.documentElement
    ]) : new Selection([
        [
            selector2
        ]
    ], root);
}
function create(name) {
    return select(creator(name).call(document.documentElement));
}
var nextId = 0;
function local() {
    return new Local();
}
function Local() {
    this._ = "@" + (++nextId).toString(36);
}
Local.prototype = local.prototype = {
    constructor: Local,
    get: function(node) {
        var id = this._;
        while(!(id in node))if (!(node = node.parentNode)) return;
        return node[id];
    },
    set: function(node, value) {
        return node[this._] = value;
    },
    remove: function(node) {
        return this._ in node && delete node[this._];
    },
    toString: function() {
        return this._;
    }
};
function sourceEvent(event) {
    let sourceEvent2;
    while(sourceEvent2 = event.sourceEvent)event = sourceEvent2;
    return event;
}
function pointer(event, node) {
    event = sourceEvent(event);
    if (node === void 0) node = event.currentTarget;
    if (node) {
        var svg = node.ownerSVGElement || node;
        if (svg.createSVGPoint) {
            var point = svg.createSVGPoint();
            point.x = event.clientX, point.y = event.clientY;
            point = point.matrixTransform(node.getScreenCTM().inverse());
            return [
                point.x,
                point.y
            ];
        }
        if (node.getBoundingClientRect) {
            var rect = node.getBoundingClientRect();
            return [
                event.clientX - rect.left - node.clientLeft,
                event.clientY - rect.top - node.clientTop
            ];
        }
    }
    return [
        event.pageX,
        event.pageY
    ];
}
const nonpassive = {
    passive: false
};
const nonpassivecapture = {
    capture: true,
    passive: false
};
function nopropagation(event) {
    event.stopImmediatePropagation();
}
function noevent(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
}
function nodrag(view) {
    var root = view.document.documentElement, selection = select(view).on("dragstart.drag", noevent, nonpassivecapture);
    if ("onselectstart" in root) {
        selection.on("selectstart.drag", noevent, nonpassivecapture);
    } else {
        root.__noselect = root.style.MozUserSelect;
        root.style.MozUserSelect = "none";
    }
}
function yesdrag(view, noclick) {
    var root = view.document.documentElement, selection = select(view).on("dragstart.drag", null);
    if (noclick) {
        selection.on("click.drag", noevent, nonpassivecapture);
        setTimeout(function() {
            selection.on("click.drag", null);
        }, 0);
    }
    if ("onselectstart" in root) {
        selection.on("selectstart.drag", null);
    } else {
        root.style.MozUserSelect = root.__noselect;
        delete root.__noselect;
    }
}
var constant2 = (x)=>()=>x
;
function DragEvent(type, { sourceEvent , subject , target , identifier , active , x , y , dx , dy , dispatch: dispatch2  }) {
    Object.defineProperties(this, {
        type: {
            value: type,
            enumerable: true,
            configurable: true
        },
        sourceEvent: {
            value: sourceEvent,
            enumerable: true,
            configurable: true
        },
        subject: {
            value: subject,
            enumerable: true,
            configurable: true
        },
        target: {
            value: target,
            enumerable: true,
            configurable: true
        },
        identifier: {
            value: identifier,
            enumerable: true,
            configurable: true
        },
        active: {
            value: active,
            enumerable: true,
            configurable: true
        },
        x: {
            value: x,
            enumerable: true,
            configurable: true
        },
        y: {
            value: y,
            enumerable: true,
            configurable: true
        },
        dx: {
            value: dx,
            enumerable: true,
            configurable: true
        },
        dy: {
            value: dy,
            enumerable: true,
            configurable: true
        },
        _: {
            value: dispatch2
        }
    });
}
DragEvent.prototype.on = function() {
    var value = this._.on.apply(this._, arguments);
    return value === this._ ? this : value;
};
function defaultFilter(event) {
    return !event.ctrlKey && !event.button;
}
function defaultContainer() {
    return this.parentNode;
}
function defaultSubject(event, d) {
    return d == null ? {
        x: event.x,
        y: event.y
    } : d;
}
function defaultTouchable() {
    return navigator.maxTouchPoints || "ontouchstart" in this;
}
function drag() {
    var filter = defaultFilter, container = defaultContainer, subject = defaultSubject, touchable = defaultTouchable, gestures = {
    }, listeners = dispatch("start", "drag", "end"), active = 0, mousedownx, mousedowny, mousemoving, touchending, clickDistance2 = 0;
    function drag2(selection) {
        selection.on("mousedown.drag", mousedowned).filter(touchable).on("touchstart.drag", touchstarted).on("touchmove.drag", touchmoved, nonpassive).on("touchend.drag touchcancel.drag", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    }
    function mousedowned(event, d) {
        if (touchending || !filter.call(this, event, d)) return;
        var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
        if (!gesture) return;
        select(event.view).on("mousemove.drag", mousemoved, nonpassivecapture).on("mouseup.drag", mouseupped, nonpassivecapture);
        nodrag(event.view);
        nopropagation(event);
        mousemoving = false;
        mousedownx = event.clientX;
        mousedowny = event.clientY;
        gesture("start", event);
    }
    function mousemoved(event) {
        noevent(event);
        if (!mousemoving) {
            var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
            mousemoving = dx * dx + dy * dy > clickDistance2;
        }
        gestures.mouse("drag", event);
    }
    function mouseupped(event) {
        select(event.view).on("mousemove.drag mouseup.drag", null);
        yesdrag(event.view, mousemoving);
        noevent(event);
        gestures.mouse("end", event);
    }
    function touchstarted(event, d) {
        if (!filter.call(this, event, d)) return;
        var touches = event.changedTouches, c = container.call(this, event, d), n = touches.length, i, gesture;
        for(i = 0; i < n; ++i){
            if (gesture = beforestart(this, c, event, d, touches[i].identifier, touches[i])) {
                nopropagation(event);
                gesture("start", event, touches[i]);
            }
        }
    }
    function touchmoved(event) {
        var touches = event.changedTouches, n = touches.length, i, gesture;
        for(i = 0; i < n; ++i){
            if (gesture = gestures[touches[i].identifier]) {
                noevent(event);
                gesture("drag", event, touches[i]);
            }
        }
    }
    function touchended(event) {
        var touches = event.changedTouches, n = touches.length, i, gesture;
        if (touchending) clearTimeout(touchending);
        touchending = setTimeout(function() {
            touchending = null;
        }, 500);
        for(i = 0; i < n; ++i){
            if (gesture = gestures[touches[i].identifier]) {
                nopropagation(event);
                gesture("end", event, touches[i]);
            }
        }
    }
    function beforestart(that, container2, event, d, identifier, touch) {
        var dispatch2 = listeners.copy(), p = pointer(touch || event, container2), dx, dy, s;
        if ((s = subject.call(that, new DragEvent("beforestart", {
            sourceEvent: event,
            target: drag2,
            identifier,
            active,
            x: p[0],
            y: p[1],
            dx: 0,
            dy: 0,
            dispatch: dispatch2
        }), d)) == null) return;
        dx = s.x - p[0] || 0;
        dy = s.y - p[1] || 0;
        return function gesture(type, event2, touch2) {
            var p0 = p, n;
            switch(type){
                case "start":
                    gestures[identifier] = gesture, n = active++;
                    break;
                case "end":
                    delete gestures[identifier], --active;
                case "drag":
                    p = pointer(touch2 || event2, container2), n = active;
                    break;
            }
            dispatch2.call(type, that, new DragEvent(type, {
                sourceEvent: event2,
                subject: s,
                target: drag2,
                identifier,
                active: n,
                x: p[0] + dx,
                y: p[1] + dy,
                dx: p[0] - p0[0],
                dy: p[1] - p0[1],
                dispatch: dispatch2
            }), d);
        };
    }
    drag2.filter = function(_) {
        return arguments.length ? (filter = typeof _ === "function" ? _ : constant2(!!_), drag2) : filter;
    };
    drag2.container = function(_) {
        return arguments.length ? (container = typeof _ === "function" ? _ : constant2(_), drag2) : container;
    };
    drag2.subject = function(_) {
        return arguments.length ? (subject = typeof _ === "function" ? _ : constant2(_), drag2) : subject;
    };
    drag2.touchable = function(_) {
        return arguments.length ? (touchable = typeof _ === "function" ? _ : constant2(!!_), drag2) : touchable;
    };
    drag2.on = function() {
        var value = listeners.on.apply(listeners, arguments);
        return value === listeners ? drag2 : value;
    };
    drag2.clickDistance = function(_) {
        return arguments.length ? (clickDistance2 = (_ = +_) * _, drag2) : Math.sqrt(clickDistance2);
    };
    return drag2;
}
const repo = "guardian/frontend";
const branch = "main";
const path = "tools/__tasks__/commercial/graph/output/standalone.commercial.ts.json";
const url = (sha = branch)=>`https://raw.githubusercontent.com/${repo}/${sha}/${path}`
;
var Groups;
(function(Groups) {
    Groups[Groups["Entry"] = 0] = "Entry";
    Groups[Groups["Typescript"] = 1] = "Typescript";
    Groups[Groups["Javascript"] = 2] = "Javascript";
    Groups[Groups["Tests"] = 3] = "Tests";
    Groups[Groups["Packages"] = 4] = "Packages";
    Groups[Groups["Hosted"] = 5] = "Hosted";
})(Groups || (Groups = {
}));
const folders = [
    "node_modules",
    "/lib/",
    "projects/commercial",
    "/hosted/",
    "projects/common", 
];
const [width, height] = [
    1200,
    600
];
const xOrigin = (folder)=>width * ((folder + 0.5) / folders.length)
;
let maximum = 0;
const yOrigin = (size, max = maximum)=>Math.round(height * (0.18 + 0.48 * (1 - size / max)))
;
const STRIP_NODES = /^.+(node_modules\/)((@(guardian|types)\/)?.+?)(\/.+)/g;
const STRIP_EXTENSION = /(\.d)?\.(j|t)s$/;
const clean = (s)=>s.replace(STRIP_EXTENSION, "").replace(STRIP_NODES, "$1$2 ")
;
const simpleHash = (s)=>s.split("").reduce((p, c)=>p + (c.codePointAt(0) ?? 9)
    , 0)
;
const getTree = async (sha)=>{
    const graph = await fetch(url(sha));
    const tree = await graph.json();
    return tree;
};
const getDataForHash = async (sha = branch)=>{
    const tree = await getTree(sha);
    delete tree["../lib/config.d.ts"];
    const maxImports = Object.entries(tree).reduce((max, value)=>{
        const [_, links] = value;
        return Math.max(max, links.length);
    }, 0);
    maximum = maxImports;
    Object.entries(tree).forEach((value)=>{
        const [, links] = value;
        links.forEach((link)=>{
            if (link.includes("node_modules")) {
                tree[clean(link)] = [];
            }
        });
    });
    console.log(tree);
    const nodes = Object.entries(tree).map((value)=>{
        const [id, links] = value;
        const group = id.includes("commercial.") ? Groups.Entry : id.includes("node_modules") ? Groups.Packages : id.includes(".ts") ? Groups.Typescript : Groups.Javascript;
        const folder = folders.reduce((prev, current, index)=>{
            return id.includes(current) ? index : prev;
        }, 0);
        const imports = links.length;
        const node = {
            id: clean(id),
            group,
            folder,
            imports
        };
        return node;
    }).map((node)=>{
        node.x = xOrigin(node.folder) - simpleHash(node.id) % 31 + 15;
        node.y = yOrigin(node.imports, maxImports) - simpleHash(node.id) % 29 + 15;
        return node;
    });
    const links = Object.entries(tree).reduce((links, branch)=>{
        const [source, targets] = branch;
        const newLinks = targets.map((target)=>({
                target: clean(target),
                source: clean(source),
                value: targets.length > 0 ? 0.5 : 0.25
            })
        );
        return [
            ...links,
            ...newLinks
        ];
    }, []);
    return {
        nodes,
        links
    };
};
function define(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
}
function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for(var key in definition)prototype[key] = definition[key];
    return prototype;
}
function Color() {
}
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*", reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*", reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*", reHex = /^#([0-9a-f]{3,8})$/, reRgbInteger = new RegExp("^rgb\\(" + [
    reI,
    reI,
    reI
] + "\\)$"), reRgbPercent = new RegExp("^rgb\\(" + [
    reP,
    reP,
    reP
] + "\\)$"), reRgbaInteger = new RegExp("^rgba\\(" + [
    reI,
    reI,
    reI,
    reN
] + "\\)$"), reRgbaPercent = new RegExp("^rgba\\(" + [
    reP,
    reP,
    reP,
    reN
] + "\\)$"), reHslPercent = new RegExp("^hsl\\(" + [
    reN,
    reP,
    reP
] + "\\)$"), reHslaPercent = new RegExp("^hsla\\(" + [
    reN,
    reP,
    reP,
    reN
] + "\\)$");
var named = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
};
define(Color, color, {
    copy: function(channels) {
        return Object.assign(new this.constructor(), this, channels);
    },
    displayable: function() {
        return this.rgb().displayable();
    },
    hex: color_formatHex,
    formatHex: color_formatHex,
    formatHsl: color_formatHsl,
    formatRgb: color_formatRgb,
    toString: color_formatRgb
});
function color_formatHex() {
    return this.rgb().formatHex();
}
function color_formatHsl() {
    return hslConvert(this).formatHsl();
}
function color_formatRgb() {
    return this.rgb().formatRgb();
}
function color(format) {
    var m, l;
    format = (format + "").trim().toLowerCase();
    return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
    return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
}
function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb();
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
}
define(Rgb, rgb, extend(Color, {
    brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb: function() {
        return this;
    },
    displayable: function() {
        return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
    },
    hex: rgb_formatHex,
    formatHex: rgb_formatHex,
    formatRgb: rgb_formatRgb,
    toString: rgb_formatRgb
}));
function rgb_formatHex() {
    return "#" + hex(this.r) + hex(this.g) + hex(this.b);
}
function rgb_formatRgb() {
    var a = this.opacity;
    a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a === 1 ? ")" : ", " + a + ")");
}
function hex(value) {
    value = Math.max(0, Math.min(255, Math.round(value) || 0));
    return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
}
function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl();
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255, g = o.g / 255, b = o.b / 255, min = Math.min(r, g, b), max = Math.max(r, g, b), h = NaN, s = max - min, l = (max + min) / 2;
    if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
    } else {
        s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
}
function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}
function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
}
define(Hsl, hsl, extend(Color, {
    brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
        var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
        return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
    },
    displayable: function() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
    },
    formatHsl: function() {
        var a = this.opacity;
        a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
        return (a === 1 ? "hsl(" : "hsla(") + (this.h || 0) + ", " + (this.s || 0) * 100 + "%, " + (this.l || 0) * 100 + "%" + (a === 1 ? ")" : ", " + a + ")");
    }
}));
function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}
const radians = Math.PI / 180;
const degrees = 180 / Math.PI;
const Xn = 0.96422, Yn = 1, Zn = 0.82521, t0 = 4 / 29, t1 = 6 / 29, t2 = 3 * t1 * t1, t3 = t1 * t1 * t1;
function labConvert(o) {
    if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
    if (o instanceof Hcl) return hcl2lab(o);
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var r = rgb2lrgb(o.r), g = rgb2lrgb(o.g), b = rgb2lrgb(o.b), y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / 1), x, z;
    if (r === g && g === b) x = z = y;
    else {
        x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
        z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
    }
    return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
}
function lab(l, a, b, opacity) {
    return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
}
function Lab(l, a, b, opacity) {
    this.l = +l;
    this.a = +a;
    this.b = +b;
    this.opacity = +opacity;
}
define(Lab, lab, extend(Color, {
    brighter: function(k) {
        return new Lab(this.l + 18 * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    darker: function(k) {
        return new Lab(this.l - 18 * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    rgb: function() {
        var y = (this.l + 16) / 116, x = isNaN(this.a) ? y : y + this.a / 500, z = isNaN(this.b) ? y : y - this.b / 200;
        x = Xn * lab2xyz(x);
        y = Yn * lab2xyz(y);
        z = Zn * lab2xyz(z);
        return new Rgb(lrgb2rgb(3.1338561 * x - 1.6168667 * y - 0.4906146 * z), lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.033454 * z), lrgb2rgb(0.0719453 * x - 0.2289914 * y + 1.4052427 * z), this.opacity);
    }
}));
function xyz2lab(t) {
    return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}
function lab2xyz(t) {
    return t > t1 ? t * t * t : t2 * (t - t0);
}
function lrgb2rgb(x) {
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}
function rgb2lrgb(x) {
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}
function hclConvert(o) {
    if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
    if (!(o instanceof Lab)) o = labConvert(o);
    if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0 < o.l && o.l < 100 ? 0 : NaN, o.l, o.opacity);
    var h = Math.atan2(o.b, o.a) * degrees;
    return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
}
function hcl(h, c, l, opacity) {
    return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}
function Hcl(h, c, l, opacity) {
    this.h = +h;
    this.c = +c;
    this.l = +l;
    this.opacity = +opacity;
}
function hcl2lab(o) {
    if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
    var h = o.h * radians;
    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
}
define(Hcl, hcl, extend(Color, {
    brighter: function(k) {
        return new Hcl(this.h, this.c, this.l + 18 * (k == null ? 1 : k), this.opacity);
    },
    darker: function(k) {
        return new Hcl(this.h, this.c, this.l - 18 * (k == null ? 1 : k), this.opacity);
    },
    rgb: function() {
        return hcl2lab(this).rgb();
    }
}));
var A = -0.14861, B = 1.78277, C = -0.29227, D = -0.90649, E = 1.97294, ED = E * D, EB = E * B, BC_DA = B * C - D * A;
function cubehelixConvert(o) {
    if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var r = o.r / 255, g = o.g / 255, b = o.b / 255, l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB), bl = b - l, k = (E * (g - l) - C * bl) / D, s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), h = s ? Math.atan2(k, bl) * degrees - 120 : NaN;
    return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
}
function cubehelix(h, s, l, opacity) {
    return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
}
function Cubehelix(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
}
define(Cubehelix, cubehelix, extend(Color, {
    brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
        var h = isNaN(this.h) ? 0 : (this.h + 120) * radians, l = +this.l, a = isNaN(this.s) ? 0 : this.s * l * (1 - l), cosh = Math.cos(h), sinh = Math.sin(h);
        return new Rgb(255 * (l + a * (A * cosh + B * sinh)), 255 * (l + a * (C * cosh + D * sinh)), 255 * (l + a * (E * cosh)), this.opacity);
    }
}));
function basis(t1, v0, v1, v2, v3) {
    var t2 = t1 * t1, t3 = t2 * t1;
    return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}
function basis$1(values) {
    var n = values.length - 1;
    return function(t) {
        var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values[i], v2 = values[i + 1], v0 = i > 0 ? values[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
        return basis((t - i / n) * n, v0, v1, v2, v3);
    };
}
function basisClosed(values) {
    var n = values.length;
    return function(t) {
        var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values[(i + n - 1) % n], v1 = values[i % n], v2 = values[(i + 1) % n], v3 = values[(i + 2) % n];
        return basis((t - i / n) * n, v0, v1, v2, v3);
    };
}
var constant3 = (x)=>()=>x
;
function linear(a, d) {
    return function(t) {
        return a + t * d;
    };
}
function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
    };
}
function hue(a, b) {
    var d = b - a;
    return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant3(isNaN(a) ? b : a);
}
function gamma(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant3(isNaN(a) ? b : a);
    };
}
function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : constant3(isNaN(a) ? b : a);
}
var rgb1 = function rgbGamma(y) {
    var color2 = gamma(y);
    function rgb2(start, end) {
        var r = color2((start = rgb(start)).r, (end = rgb(end)).r), g = color2(start.g, end.g), b = color2(start.b, end.b), opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
            start.r = r(t);
            start.g = g(t);
            start.b = b(t);
            start.opacity = opacity(t);
            return start + "";
        };
    }
    rgb2.gamma = rgbGamma;
    return rgb2;
}(1);
function rgbSpline(spline) {
    return function(colors) {
        var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color2;
        for(i = 0; i < n; ++i){
            color2 = rgb(colors[i]);
            r[i] = color2.r || 0;
            g[i] = color2.g || 0;
            b[i] = color2.b || 0;
        }
        r = spline(r);
        g = spline(g);
        b = spline(b);
        color2.opacity = 1;
        return function(t) {
            color2.r = r(t);
            color2.g = g(t);
            color2.b = b(t);
            return color2 + "";
        };
    };
}
var rgbBasis = rgbSpline(basis$1);
rgbSpline(basisClosed);
function numberArray(a, b) {
    if (!b) b = [];
    var n = a ? Math.min(b.length, a.length) : 0, c = b.slice(), i;
    return function(t) {
        for(i = 0; i < n; ++i)c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
    };
}
function isNumberArray(x) {
    return ArrayBuffer.isView(x) && !(x instanceof DataView);
}
function genericArray(a, b) {
    var nb = b ? b.length : 0, na = a ? Math.min(nb, a.length) : 0, x = new Array(na), c = new Array(nb), i;
    for(i = 0; i < na; ++i)x[i] = value(a[i], b[i]);
    for(; i < nb; ++i)c[i] = b[i];
    return function(t) {
        for(i = 0; i < na; ++i)c[i] = x[i](t);
        return c;
    };
}
function date(a, b) {
    var d = new Date();
    return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
    };
}
function number(a, b) {
    return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
    };
}
function object(a, b) {
    var i = {
    }, c = {
    }, k;
    if (a === null || typeof a !== "object") a = {
    };
    if (b === null || typeof b !== "object") b = {
    };
    for(k in b){
        if (k in a) {
            i[k] = value(a[k], b[k]);
        } else {
            c[k] = b[k];
        }
    }
    return function(t) {
        for(k in i)c[k] = i[k](t);
        return c;
    };
}
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, reB = new RegExp(reA.source, "g");
function zero(b) {
    return function() {
        return b;
    };
}
function one(b) {
    return function(t) {
        return b(t) + "";
    };
}
function string(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
    a = a + "", b = b + "";
    while((am = reA.exec(a)) && (bm = reB.exec(b))){
        if ((bs = bm.index) > bi) {
            bs = b.slice(bi, bs);
            if (s[i]) s[i] += bs;
            else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) {
            if (s[i]) s[i] += bm;
            else s[++i] = bm;
        } else {
            s[++i] = null;
            q.push({
                i,
                x: number(am, bm)
            });
        }
        bi = reB.lastIndex;
    }
    if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs;
        else s[++i] = bs;
    }
    return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function(t) {
        for(var i2 = 0, o; i2 < b; ++i2)s[(o = q[i2]).i] = o.x(t);
        return s.join("");
    });
}
function value(a, b) {
    var t = typeof b, c;
    return b == null || t === "boolean" ? constant3(b) : (t === "number" ? number : t === "string" ? (c = color(b)) ? (b = c, rgb1) : string : b instanceof color ? rgb1 : b instanceof Date ? date : isNumberArray(b) ? numberArray : Array.isArray(b) ? genericArray : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object : number)(a, b);
}
var degrees1 = 180 / Math.PI;
var identity = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
};
function decompose(a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
        translateX: e,
        translateY: f,
        rotate: Math.atan2(b, a) * degrees1,
        skewX: Math.atan(skewX) * degrees1,
        scaleX,
        scaleY
    };
}
var svgNode;
function parseCss(value2) {
    const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value2 + "");
    return m.isIdentity ? identity : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
}
function parseSvg(value2) {
    if (value2 == null) return identity;
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value2);
    if (!(value2 = svgNode.transform.baseVal.consolidate())) return identity;
    value2 = value2.matrix;
    return decompose(value2.a, value2.b, value2.c, value2.d, value2.e, value2.f);
}
function interpolateTransform(parse, pxComma, pxParen, degParen) {
    function pop(s) {
        return s.length ? s.pop() + " " : "";
    }
    function translate(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
            var i = s.push("translate(", null, pxComma, null, pxParen);
            q.push({
                i: i - 4,
                x: number(xa, xb)
            }, {
                i: i - 2,
                x: number(ya, yb)
            });
        } else if (xb || yb) {
            s.push("translate(" + xb + pxComma + yb + pxParen);
        }
    }
    function rotate(a, b, s, q) {
        if (a !== b) {
            if (a - b > 180) b += 360;
            else if (b - a > 180) a += 360;
            q.push({
                i: s.push(pop(s) + "rotate(", null, degParen) - 2,
                x: number(a, b)
            });
        } else if (b) {
            s.push(pop(s) + "rotate(" + b + degParen);
        }
    }
    function skewX(a, b, s, q) {
        if (a !== b) {
            q.push({
                i: s.push(pop(s) + "skewX(", null, degParen) - 2,
                x: number(a, b)
            });
        } else if (b) {
            s.push(pop(s) + "skewX(" + b + degParen);
        }
    }
    function scale(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
            var i = s.push(pop(s) + "scale(", null, ",", null, ")");
            q.push({
                i: i - 4,
                x: number(xa, xb)
            }, {
                i: i - 2,
                x: number(ya, yb)
            });
        } else if (xb !== 1 || yb !== 1) {
            s.push(pop(s) + "scale(" + xb + "," + yb + ")");
        }
    }
    return function(a, b) {
        var s = [], q = [];
        a = parse(a), b = parse(b);
        translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
        rotate(a.rotate, b.rotate, s, q);
        skewX(a.skewX, b.skewX, s, q);
        scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
        a = b = null;
        return function(t) {
            var i = -1, n = q.length, o;
            while(++i < n)s[(o = q[i]).i] = o.x(t);
            return s.join("");
        };
    };
}
var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");
var epsilon2 = 0.000000000001;
function cosh(x) {
    return ((x = Math.exp(x)) + 1 / x) / 2;
}
function sinh(x) {
    return ((x = Math.exp(x)) - 1 / x) / 2;
}
function tanh(x) {
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}
(function zoomRho(rho, rho2, rho4) {
    function zoom2(p0, p1) {
        var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
        if (d2 < epsilon2) {
            S = Math.log(w1 / w0) / rho;
            i = function(t) {
                return [
                    ux0 + t * dx,
                    uy0 + t * dy,
                    w0 * Math.exp(rho * t * S)
                ];
            };
        } else {
            var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
            S = (r1 - r0) / rho;
            i = function(t) {
                var s = t * S, coshr0 = cosh(r0), u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
                return [
                    ux0 + u * dx,
                    uy0 + u * dy,
                    w0 * coshr0 / cosh(rho * s + r0)
                ];
            };
        }
        i.duration = S * 1000 * rho / Math.SQRT2;
        return i;
    }
    zoom2.rho = function(_) {
        var _1 = Math.max(0.001, +_), _2 = _1 * _1, _4 = _2 * _2;
        return zoomRho(_1, _2, _4);
    };
    return zoom2;
})(Math.SQRT2, 2, 4);
function hsl1(hue2) {
    return function(start, end) {
        var h = hue2((start = hsl(start)).h, (end = hsl(end)).h), s = nogamma(start.s, end.s), l = nogamma(start.l, end.l), opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
            start.h = h(t);
            start.s = s(t);
            start.l = l(t);
            start.opacity = opacity(t);
            return start + "";
        };
    };
}
hsl1(hue);
hsl1(nogamma);
function hcl1(hue2) {
    return function(start, end) {
        var h = hue2((start = hcl(start)).h, (end = hcl(end)).h), c = nogamma(start.c, end.c), l = nogamma(start.l, end.l), opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
            start.h = h(t);
            start.c = c(t);
            start.l = l(t);
            start.opacity = opacity(t);
            return start + "";
        };
    };
}
hcl1(hue);
hcl1(nogamma);
function cubehelix1(hue2) {
    return (function cubehelixGamma(y) {
        y = +y;
        function cubehelix2(start, end) {
            var h = hue2((start = cubehelix(start)).h, (end = cubehelix(end)).h), s = nogamma(start.s, end.s), l = nogamma(start.l, end.l), opacity = nogamma(start.opacity, end.opacity);
            return function(t) {
                start.h = h(t);
                start.s = s(t);
                start.l = l(Math.pow(t, y));
                start.opacity = opacity(t);
                return start + "";
            };
        }
        cubehelix2.gamma = cubehelixGamma;
        return cubehelix2;
    })(1);
}
cubehelix1(hue);
var cubehelixLong = cubehelix1(nogamma);
function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var exponent = 3;
(function custom(e) {
    e = +e;
    function polyIn2(t) {
        return Math.pow(t, e);
    }
    polyIn2.exponent = custom;
    return polyIn2;
})(exponent);
(function custom2(e) {
    e = +e;
    function polyOut2(t) {
        return 1 - Math.pow(1 - t, e);
    }
    polyOut2.exponent = custom2;
    return polyOut2;
})(exponent);
(function custom3(e) {
    e = +e;
    function polyInOut2(t) {
        return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
    }
    polyInOut2.exponent = custom3;
    return polyInOut2;
})(exponent);
function tpmt(x) {
    return (Math.pow(2, -10 * x) - 0.0009765625) * 1.0009775171065494;
}
var overshoot = 1.70158;
(function custom4(s) {
    s = +s;
    function backIn2(t) {
        return (t = +t) * t * (s * (t - 1) + t);
    }
    backIn2.overshoot = custom4;
    return backIn2;
})(overshoot);
(function custom5(s) {
    s = +s;
    function backOut2(t) {
        return --t * t * ((t + 1) * s + t) + 1;
    }
    backOut2.overshoot = custom5;
    return backOut2;
})(overshoot);
(function custom6(s) {
    s = +s;
    function backInOut2(t) {
        return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
    }
    backInOut2.overshoot = custom6;
    return backInOut2;
})(overshoot);
var tau = 2 * Math.PI, amplitude = 1, period = 0.3;
(function custom7(a, p) {
    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
    function elasticIn2(t) {
        return a * tpmt(- --t) * Math.sin((s - t) / p);
    }
    elasticIn2.amplitude = function(a2) {
        return custom7(a2, p * tau);
    };
    elasticIn2.period = function(p2) {
        return custom7(a, p2);
    };
    return elasticIn2;
})(amplitude, period);
(function custom8(a, p) {
    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
    function elasticOut2(t) {
        return 1 - a * tpmt(t = +t) * Math.sin((t + s) / p);
    }
    elasticOut2.amplitude = function(a2) {
        return custom8(a2, p * tau);
    };
    elasticOut2.period = function(p2) {
        return custom8(a, p2);
    };
    return elasticOut2;
})(amplitude, period);
(function custom9(a, p) {
    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
    function elasticInOut2(t) {
        return ((t = t * 2 - 1) < 0 ? a * tpmt(-t) * Math.sin((s - t) / p) : 2 - a * tpmt(t) * Math.sin((s + t) / p)) / 2;
    }
    elasticInOut2.amplitude = function(a2) {
        return custom9(a2, p * tau);
    };
    elasticInOut2.period = function(p2) {
        return custom9(a, p2);
    };
    return elasticInOut2;
})(amplitude, period);
var emptyOn = dispatch("start", "end", "cancel", "interrupt");
var emptyTween = [];
var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;
function schedule(node, name, id2, index, group, timing) {
    var schedules = node.__transition;
    if (!schedules) node.__transition = {
    };
    else if (id2 in schedules) return;
    create1(node, id2, {
        name,
        index,
        group,
        on: emptyOn,
        tween: emptyTween,
        time: timing.time,
        delay: timing.delay,
        duration: timing.duration,
        ease: timing.ease,
        timer: null,
        state: CREATED
    });
}
function init(node, id2) {
    var schedule2 = get1(node, id2);
    if (schedule2.state > CREATED) throw new Error("too late; already scheduled");
    return schedule2;
}
function set1(node, id2) {
    var schedule2 = get1(node, id2);
    if (schedule2.state > STARTED) throw new Error("too late; already running");
    return schedule2;
}
function get1(node, id2) {
    var schedule2 = node.__transition;
    if (!schedule2 || !(schedule2 = schedule2[id2])) throw new Error("transition not found");
    return schedule2;
}
function create1(node, id2, self) {
    var schedules = node.__transition, tween;
    schedules[id2] = self;
    self.timer = timer(schedule2, 0, self.time);
    function schedule2(elapsed) {
        self.state = SCHEDULED;
        self.timer.restart(start2, self.delay, self.time);
        if (self.delay <= elapsed) start2(elapsed - self.delay);
    }
    function start2(elapsed) {
        var i, j, n, o;
        if (self.state !== SCHEDULED) return stop();
        for(i in schedules){
            o = schedules[i];
            if (o.name !== self.name) continue;
            if (o.state === STARTED) return timeout$1(start2);
            if (o.state === RUNNING) {
                o.state = ENDED;
                o.timer.stop();
                o.on.call("interrupt", node, node.__data__, o.index, o.group);
                delete schedules[i];
            } else if (+i < id2) {
                o.state = ENDED;
                o.timer.stop();
                o.on.call("cancel", node, node.__data__, o.index, o.group);
                delete schedules[i];
            }
        }
        timeout$1(function() {
            if (self.state === STARTED) {
                self.state = RUNNING;
                self.timer.restart(tick, self.delay, self.time);
                tick(elapsed);
            }
        });
        self.state = STARTING;
        self.on.call("start", node, node.__data__, self.index, self.group);
        if (self.state !== STARTING) return;
        self.state = STARTED;
        tween = new Array(n = self.tween.length);
        for(i = 0, j = -1; i < n; ++i){
            if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
                tween[++j] = o;
            }
        }
        tween.length = j + 1;
    }
    function tick(elapsed) {
        var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1), i = -1, n = tween.length;
        while(++i < n){
            tween[i].call(node, t);
        }
        if (self.state === ENDING) {
            self.on.call("end", node, node.__data__, self.index, self.group);
            stop();
        }
    }
    function stop() {
        self.state = ENDED;
        self.timer.stop();
        delete schedules[id2];
        for(var i in schedules)return;
        delete node.__transition;
    }
}
function interrupt(node, name) {
    var schedules = node.__transition, schedule2, active2, empty = true, i;
    if (!schedules) return;
    name = name == null ? null : name + "";
    for(i in schedules){
        if ((schedule2 = schedules[i]).name !== name) {
            empty = false;
            continue;
        }
        active2 = schedule2.state > STARTING && schedule2.state < ENDING;
        schedule2.state = ENDED;
        schedule2.timer.stop();
        schedule2.on.call(active2 ? "interrupt" : "cancel", node, node.__data__, schedule2.index, schedule2.group);
        delete schedules[i];
    }
    if (empty) delete node.__transition;
}
function selection_interrupt(name) {
    return this.each(function() {
        interrupt(this, name);
    });
}
function tweenRemove(id2, name) {
    var tween0, tween1;
    return function() {
        var schedule2 = set1(this, id2), tween = schedule2.tween;
        if (tween !== tween0) {
            tween1 = tween0 = tween;
            for(var i = 0, n = tween1.length; i < n; ++i){
                if (tween1[i].name === name) {
                    tween1 = tween1.slice();
                    tween1.splice(i, 1);
                    break;
                }
            }
        }
        schedule2.tween = tween1;
    };
}
function tweenFunction(id2, name, value) {
    var tween0, tween1;
    if (typeof value !== "function") throw new Error();
    return function() {
        var schedule2 = set1(this, id2), tween = schedule2.tween;
        if (tween !== tween0) {
            tween1 = (tween0 = tween).slice();
            for(var t = {
                name,
                value
            }, i = 0, n = tween1.length; i < n; ++i){
                if (tween1[i].name === name) {
                    tween1[i] = t;
                    break;
                }
            }
            if (i === n) tween1.push(t);
        }
        schedule2.tween = tween1;
    };
}
function transition_tween(name, value) {
    var id2 = this._id;
    name += "";
    if (arguments.length < 2) {
        var tween = get1(this.node(), id2).tween;
        for(var i = 0, n = tween.length, t; i < n; ++i){
            if ((t = tween[i]).name === name) {
                return t.value;
            }
        }
        return null;
    }
    return this.each((value == null ? tweenRemove : tweenFunction)(id2, name, value));
}
function tweenValue(transition2, name, value) {
    var id2 = transition2._id;
    transition2.each(function() {
        var schedule2 = set1(this, id2);
        (schedule2.value || (schedule2.value = {
        }))[name] = value.apply(this, arguments);
    });
    return function(node) {
        return get1(node, id2).value[name];
    };
}
function interpolate(a, b) {
    var c;
    return (typeof b === "number" ? number : b instanceof color ? rgb1 : (c = color(b)) ? (b = c, rgb1) : string)(a, b);
}
function attrRemove1(name) {
    return function() {
        this.removeAttribute(name);
    };
}
function attrRemoveNS1(fullname) {
    return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
    };
}
function attrConstant1(name, interpolate2, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
        var string0 = this.getAttribute(name);
        return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
    };
}
function attrConstantNS1(fullname, interpolate2, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
        var string0 = this.getAttributeNS(fullname.space, fullname.local);
        return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
    };
}
function attrFunction1(name, interpolate2, value) {
    var string00, string10, interpolate0;
    return function() {
        var string0, value1 = value(this), string1;
        if (value1 == null) return void this.removeAttribute(name);
        string0 = this.getAttribute(name);
        string1 = value1 + "";
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
    };
}
function attrFunctionNS1(fullname, interpolate2, value) {
    var string00, string10, interpolate0;
    return function() {
        var string0, value1 = value(this), string1;
        if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
        string0 = this.getAttributeNS(fullname.space, fullname.local);
        string1 = value1 + "";
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
    };
}
function transition_attr(name, value) {
    var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
    return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS1 : attrFunction1)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS1 : attrRemove1)(fullname) : (fullname.local ? attrConstantNS1 : attrConstant1)(fullname, i, value));
}
function attrInterpolate(name, i) {
    return function(t) {
        this.setAttribute(name, i.call(this, t));
    };
}
function attrInterpolateNS(fullname, i) {
    return function(t) {
        this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
    };
}
function attrTweenNS(fullname, value) {
    var t0, i0;
    function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
        return t0;
    }
    tween._value = value;
    return tween;
}
function attrTween(name, value) {
    var t0, i0;
    function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
        return t0;
    }
    tween._value = value;
    return tween;
}
function transition_attrTween(name, value) {
    var key = "attr." + name;
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error();
    var fullname = namespace(name);
    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}
function delayFunction(id2, value) {
    return function() {
        init(this, id2).delay = +value.apply(this, arguments);
    };
}
function delayConstant(id2, value) {
    return value = +value, function() {
        init(this, id2).delay = value;
    };
}
function transition_delay(value) {
    var id2 = this._id;
    return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id2, value)) : get1(this.node(), id2).delay;
}
function durationFunction(id2, value) {
    return function() {
        set1(this, id2).duration = +value.apply(this, arguments);
    };
}
function durationConstant(id2, value) {
    return value = +value, function() {
        set1(this, id2).duration = value;
    };
}
function transition_duration(value) {
    var id2 = this._id;
    return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id2, value)) : get1(this.node(), id2).duration;
}
function easeConstant(id2, value) {
    if (typeof value !== "function") throw new Error();
    return function() {
        set1(this, id2).ease = value;
    };
}
function transition_ease(value) {
    var id2 = this._id;
    return arguments.length ? this.each(easeConstant(id2, value)) : get1(this.node(), id2).ease;
}
function easeVarying(id2, value) {
    return function() {
        var v = value.apply(this, arguments);
        if (typeof v !== "function") throw new Error();
        set1(this, id2).ease = v;
    };
}
function transition_easeVarying(value) {
    if (typeof value !== "function") throw new Error();
    return this.each(easeVarying(this._id, value));
}
function transition_filter(match) {
    if (typeof match !== "function") match = matcher(match);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i){
            if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
                subgroup.push(node);
            }
        }
    }
    return new Transition(subgroups, this._parents, this._name, this._id);
}
function transition_merge(transition2) {
    if (transition2._id !== this._id) throw new Error();
    for(var groups0 = this._groups, groups1 = transition2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j){
        for(var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i){
            if (node = group0[i] || group1[i]) {
                merge[i] = node;
            }
        }
    }
    for(; j < m0; ++j){
        merges[j] = groups0[j];
    }
    return new Transition(merges, this._parents, this._name, this._id);
}
function start(name) {
    return (name + "").trim().split(/^|\s+/).every(function(t) {
        var i = t.indexOf(".");
        if (i >= 0) t = t.slice(0, i);
        return !t || t === "start";
    });
}
function onFunction(id2, name, listener) {
    var on0, on1, sit = start(name) ? init : set1;
    return function() {
        var schedule2 = sit(this, id2), on = schedule2.on;
        if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
        schedule2.on = on1;
    };
}
function transition_on(name, listener) {
    var id2 = this._id;
    return arguments.length < 2 ? get1(this.node(), id2).on.on(name) : this.each(onFunction(id2, name, listener));
}
function removeFunction(id2) {
    return function() {
        var parent = this.parentNode;
        for(var i in this.__transition)if (+i !== id2) return;
        if (parent) parent.removeChild(this);
    };
}
function transition_remove() {
    return this.on("end.remove", removeFunction(this._id));
}
function transition_select(select) {
    var name = this._name, id2 = this._id;
    if (typeof select !== "function") select = selector(select);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i){
            if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
                if ("__data__" in node) subnode.__data__ = node.__data__;
                subgroup[i] = subnode;
                schedule(subgroup[i], name, id2, i, subgroup, get1(node, id2));
            }
        }
    }
    return new Transition(subgroups, this._parents, name, id2);
}
function transition_selectAll(select) {
    var name = this._name, id2 = this._id;
    if (typeof select !== "function") select = selectorAll(select);
    for(var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
            if (node = group[i]) {
                for(var children = select.call(node, node.__data__, i, group), child, inherit2 = get1(node, id2), k = 0, l = children.length; k < l; ++k){
                    if (child = children[k]) {
                        schedule(child, name, id2, k, children, inherit2);
                    }
                }
                subgroups.push(children);
                parents.push(node);
            }
        }
    }
    return new Transition(subgroups, parents, name, id2);
}
var Selection1 = selection.prototype.constructor;
function transition_selection() {
    return new Selection1(this._groups, this._parents);
}
function styleNull(name, interpolate2) {
    var string00, string10, interpolate0;
    return function() {
        var string0 = styleValue(this, name), string1 = (this.style.removeProperty(name), styleValue(this, name));
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, string10 = string1);
    };
}
function styleRemove1(name) {
    return function() {
        this.style.removeProperty(name);
    };
}
function styleConstant1(name, interpolate2, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
        var string0 = styleValue(this, name);
        return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
    };
}
function styleFunction1(name, interpolate2, value) {
    var string00, string10, interpolate0;
    return function() {
        var string0 = styleValue(this, name), value1 = value(this), string1 = value1 + "";
        if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
    };
}
function styleMaybeRemove(id2, name) {
    var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
    return function() {
        var schedule2 = set1(this, id2), on = schedule2.on, listener = schedule2.value[key] == null ? remove || (remove = styleRemove1(name)) : void 0;
        if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
        schedule2.on = on1;
    };
}
function transition_style(name, value, priority) {
    var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
    return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove1(name)) : typeof value === "function" ? this.styleTween(name, styleFunction1(name, i, tweenValue(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant1(name, i, value), priority).on("end.style." + name, null);
}
function styleInterpolate(name, i, priority) {
    return function(t) {
        this.style.setProperty(name, i.call(this, t), priority);
    };
}
function styleTween(name, value, priority) {
    var t, i0;
    function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
        return t;
    }
    tween._value = value;
    return tween;
}
function transition_styleTween(name, value, priority) {
    var key = "style." + (name += "");
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error();
    return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}
function textConstant1(value) {
    return function() {
        this.textContent = value;
    };
}
function textFunction1(value) {
    return function() {
        var value1 = value(this);
        this.textContent = value1 == null ? "" : value1;
    };
}
function transition_text(value) {
    return this.tween("text", typeof value === "function" ? textFunction1(tweenValue(this, "text", value)) : textConstant1(value == null ? "" : value + ""));
}
function textInterpolate(i) {
    return function(t) {
        this.textContent = i.call(this, t);
    };
}
function textTween(value) {
    var t0, i0;
    function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
        return t0;
    }
    tween._value = value;
    return tween;
}
function transition_textTween(value) {
    var key = "text";
    if (arguments.length < 1) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error();
    return this.tween(key, textTween(value));
}
function transition_transition() {
    var name = this._name, id0 = this._id, id1 = newId();
    for(var groups = this._groups, m = groups.length, j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
            if (node = group[i]) {
                var inherit2 = get1(node, id0);
                schedule(node, name, id1, i, group, {
                    time: inherit2.time + inherit2.delay + inherit2.duration,
                    delay: 0,
                    duration: inherit2.duration,
                    ease: inherit2.ease
                });
            }
        }
    }
    return new Transition(groups, this._parents, name, id1);
}
function transition_end() {
    var on0, on1, that = this, id2 = that._id, size = that.size();
    return new Promise(function(resolve, reject) {
        var cancel = {
            value: reject
        }, end = {
            value: function() {
                if (--size === 0) resolve();
            }
        };
        that.each(function() {
            var schedule2 = set1(this, id2), on = schedule2.on;
            if (on !== on0) {
                on1 = (on0 = on).copy();
                on1._.cancel.push(cancel);
                on1._.interrupt.push(cancel);
                on1._.end.push(end);
            }
            schedule2.on = on1;
        });
        if (size === 0) resolve();
    });
}
var id = 0;
function Transition(groups, parents, name, id2) {
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id2;
}
function transition(name) {
    return selection().transition(name);
}
function newId() {
    return ++id;
}
var selection_prototype = selection.prototype;
Transition.prototype = transition.prototype = {
    constructor: Transition,
    select: transition_select,
    selectAll: transition_selectAll,
    selectChild: selection_prototype.selectChild,
    selectChildren: selection_prototype.selectChildren,
    filter: transition_filter,
    merge: transition_merge,
    selection: transition_selection,
    transition: transition_transition,
    call: selection_prototype.call,
    nodes: selection_prototype.nodes,
    node: selection_prototype.node,
    size: selection_prototype.size,
    empty: selection_prototype.empty,
    each: selection_prototype.each,
    on: transition_on,
    attr: transition_attr,
    attrTween: transition_attrTween,
    style: transition_style,
    styleTween: transition_styleTween,
    text: transition_text,
    textTween: transition_textTween,
    remove: transition_remove,
    tween: transition_tween,
    delay: transition_delay,
    duration: transition_duration,
    ease: transition_ease,
    easeVarying: transition_easeVarying,
    end: transition_end,
    [Symbol.iterator]: selection_prototype[Symbol.iterator]
};
var defaultTiming = {
    time: null,
    delay: 0,
    duration: 250,
    ease: cubicInOut
};
function inherit(node, id2) {
    var timing;
    while(!(timing = node.__transition) || !(timing = timing[id2])){
        if (!(node = node.parentNode)) {
            throw new Error(`transition ${id2} not found`);
        }
    }
    return timing;
}
function selection_transition(name) {
    var id2, timing;
    if (name instanceof Transition) {
        id2 = name._id, name = name._name;
    } else {
        id2 = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
    }
    for(var groups = this._groups, m = groups.length, j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
            if (node = group[i]) {
                schedule(node, name, id2, i, group, timing || inherit(node, id2));
            }
        }
    }
    return new Transition(groups, this._parents, name, id2);
}
selection.prototype.interrupt = selection_interrupt;
selection.prototype.transition = selection_transition;
function colors(specifier) {
    var n = specifier.length / 6 | 0, colors2 = new Array(n), i = 0;
    while(i < n)colors2[i] = "#" + specifier.slice(i * 6, ++i * 6);
    return colors2;
}
var category10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");
colors("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666");
colors("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666");
colors("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928");
colors("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2");
colors("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc");
colors("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999");
colors("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3");
colors("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");
colors("4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab");
var ramp = (scheme2)=>rgbBasis(scheme2[scheme2.length - 1])
;
var scheme = new Array(3).concat("d8b365f5f5f55ab4ac", "a6611adfc27d80cdc1018571", "a6611adfc27df5f5f580cdc1018571", "8c510ad8b365f6e8c3c7eae55ab4ac01665e", "8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e", "8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e", "8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e", "5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30", "5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30").map(colors);
ramp(scheme);
var scheme$1 = new Array(3).concat("af8dc3f7f7f77fbf7b", "7b3294c2a5cfa6dba0008837", "7b3294c2a5cff7f7f7a6dba0008837", "762a83af8dc3e7d4e8d9f0d37fbf7b1b7837", "762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837", "762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837", "762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837", "40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b", "40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b").map(colors);
ramp(scheme$1);
var scheme$2 = new Array(3).concat("e9a3c9f7f7f7a1d76a", "d01c8bf1b6dab8e1864dac26", "d01c8bf1b6daf7f7f7b8e1864dac26", "c51b7de9a3c9fde0efe6f5d0a1d76a4d9221", "c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221", "c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221", "c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221", "8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419", "8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419").map(colors);
ramp(scheme$2);
var scheme$3 = new Array(3).concat("998ec3f7f7f7f1a340", "5e3c99b2abd2fdb863e66101", "5e3c99b2abd2f7f7f7fdb863e66101", "542788998ec3d8daebfee0b6f1a340b35806", "542788998ec3d8daebf7f7f7fee0b6f1a340b35806", "5427888073acb2abd2d8daebfee0b6fdb863e08214b35806", "5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806", "2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08", "2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08").map(colors);
ramp(scheme$3);
var scheme$4 = new Array(3).concat("ef8a62f7f7f767a9cf", "ca0020f4a58292c5de0571b0", "ca0020f4a582f7f7f792c5de0571b0", "b2182bef8a62fddbc7d1e5f067a9cf2166ac", "b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac", "b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac", "b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac", "67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061", "67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061").map(colors);
ramp(scheme$4);
var scheme$5 = new Array(3).concat("ef8a62ffffff999999", "ca0020f4a582bababa404040", "ca0020f4a582ffffffbababa404040", "b2182bef8a62fddbc7e0e0e09999994d4d4d", "b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d", "b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d", "b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d", "67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a", "67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a").map(colors);
ramp(scheme$5);
var scheme$6 = new Array(3).concat("fc8d59ffffbf91bfdb", "d7191cfdae61abd9e92c7bb6", "d7191cfdae61ffffbfabd9e92c7bb6", "d73027fc8d59fee090e0f3f891bfdb4575b4", "d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4", "d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4", "d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4", "a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695", "a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695").map(colors);
ramp(scheme$6);
var scheme$7 = new Array(3).concat("fc8d59ffffbf91cf60", "d7191cfdae61a6d96a1a9641", "d7191cfdae61ffffbfa6d96a1a9641", "d73027fc8d59fee08bd9ef8b91cf601a9850", "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850", "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850", "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850", "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837", "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837").map(colors);
ramp(scheme$7);
var scheme$8 = new Array(3).concat("fc8d59ffffbf99d594", "d7191cfdae61abdda42b83ba", "d7191cfdae61ffffbfabdda42b83ba", "d53e4ffc8d59fee08be6f59899d5943288bd", "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd", "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd", "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd", "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2", "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2").map(colors);
ramp(scheme$8);
var scheme$9 = new Array(3).concat("e5f5f999d8c92ca25f", "edf8fbb2e2e266c2a4238b45", "edf8fbb2e2e266c2a42ca25f006d2c", "edf8fbccece699d8c966c2a42ca25f006d2c", "edf8fbccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b").map(colors);
ramp(scheme$9);
var scheme$a = new Array(3).concat("e0ecf49ebcda8856a7", "edf8fbb3cde38c96c688419d", "edf8fbb3cde38c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b").map(colors);
ramp(scheme$a);
var scheme$b = new Array(3).concat("e0f3dba8ddb543a2ca", "f0f9e8bae4bc7bccc42b8cbe", "f0f9e8bae4bc7bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081").map(colors);
ramp(scheme$b);
var scheme$c = new Array(3).concat("fee8c8fdbb84e34a33", "fef0d9fdcc8afc8d59d7301f", "fef0d9fdcc8afc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000").map(colors);
ramp(scheme$c);
var scheme$d = new Array(3).concat("ece2f0a6bddb1c9099", "f6eff7bdc9e167a9cf02818a", "f6eff7bdc9e167a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636").map(colors);
ramp(scheme$d);
var scheme$e = new Array(3).concat("ece7f2a6bddb2b8cbe", "f1eef6bdc9e174a9cf0570b0", "f1eef6bdc9e174a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858").map(colors);
ramp(scheme$e);
var scheme$f = new Array(3).concat("e7e1efc994c7dd1c77", "f1eef6d7b5d8df65b0ce1256", "f1eef6d7b5d8df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f").map(colors);
ramp(scheme$f);
var scheme$g = new Array(3).concat("fde0ddfa9fb5c51b8a", "feebe2fbb4b9f768a1ae017e", "feebe2fbb4b9f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a").map(colors);
ramp(scheme$g);
var scheme$h = new Array(3).concat("edf8b17fcdbb2c7fb8", "ffffcca1dab441b6c4225ea8", "ffffcca1dab441b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58").map(colors);
ramp(scheme$h);
var scheme$i = new Array(3).concat("f7fcb9addd8e31a354", "ffffccc2e69978c679238443", "ffffccc2e69978c67931a354006837", "ffffccd9f0a3addd8e78c67931a354006837", "ffffccd9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529").map(colors);
ramp(scheme$i);
var scheme$j = new Array(3).concat("fff7bcfec44fd95f0e", "ffffd4fed98efe9929cc4c02", "ffffd4fed98efe9929d95f0e993404", "ffffd4fee391fec44ffe9929d95f0e993404", "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506").map(colors);
ramp(scheme$j);
var scheme$k = new Array(3).concat("ffeda0feb24cf03b20", "ffffb2fecc5cfd8d3ce31a1c", "ffffb2fecc5cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026").map(colors);
ramp(scheme$k);
var scheme$l = new Array(3).concat("deebf79ecae13182bd", "eff3ffbdd7e76baed62171b5", "eff3ffbdd7e76baed63182bd08519c", "eff3ffc6dbef9ecae16baed63182bd08519c", "eff3ffc6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b").map(colors);
ramp(scheme$l);
var scheme$m = new Array(3).concat("e5f5e0a1d99b31a354", "edf8e9bae4b374c476238b45", "edf8e9bae4b374c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b").map(colors);
ramp(scheme$m);
var scheme$n = new Array(3).concat("f0f0f0bdbdbd636363", "f7f7f7cccccc969696525252", "f7f7f7cccccc969696636363252525", "f7f7f7d9d9d9bdbdbd969696636363252525", "f7f7f7d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000").map(colors);
ramp(scheme$n);
var scheme$o = new Array(3).concat("efedf5bcbddc756bb1", "f2f0f7cbc9e29e9ac86a51a3", "f2f0f7cbc9e29e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d").map(colors);
ramp(scheme$o);
var scheme$p = new Array(3).concat("fee0d2fc9272de2d26", "fee5d9fcae91fb6a4acb181d", "fee5d9fcae91fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d").map(colors);
ramp(scheme$p);
var scheme$q = new Array(3).concat("fee6cefdae6be6550d", "feeddefdbe85fd8d3cd94701", "feeddefdbe85fd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704").map(colors);
ramp(scheme$q);
cubehelixLong(cubehelix(300, 0.5, 0), cubehelix(-240, 0.5, 1));
cubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.5, 0.8));
cubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.5, 0.8));
cubehelix();
rgb();
function ramp$1(range) {
    var n = range.length;
    return function(t) {
        return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
    };
}
ramp$1(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));
ramp$1(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));
ramp$1(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));
ramp$1(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));
class InternMap extends Map {
    constructor(entries, key = keyof){
        super();
        Object.defineProperties(this, {
            _intern: {
                value: new Map()
            },
            _key: {
                value: key
            }
        });
        if (entries != null) for (const [key2, value] of entries)this.set(key2, value);
    }
    get(key) {
        return super.get(intern_get(this, key));
    }
    has(key) {
        return super.has(intern_get(this, key));
    }
    set(key, value) {
        return super.set(intern_set(this, key), value);
    }
    delete(key) {
        return super.delete(intern_delete(this, key));
    }
}
function intern_get({ _intern , _key  }, value) {
    const key = _key(value);
    return _intern.has(key) ? _intern.get(key) : value;
}
function intern_set({ _intern , _key  }, value) {
    const key = _key(value);
    if (_intern.has(key)) return _intern.get(key);
    _intern.set(key, value);
    return value;
}
function intern_delete({ _intern , _key  }, value) {
    const key = _key(value);
    if (_intern.has(key)) {
        value = _intern.get(key);
        _intern.delete(key);
    }
    return value;
}
function keyof(value) {
    return value !== null && typeof value === "object" ? value.valueOf() : value;
}
function ascending1(a, b) {
    return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
function bisector(f) {
    let delta = f;
    let compare1 = f;
    let compare2 = f;
    if (f.length !== 2) {
        delta = (d, x)=>f(d) - x
        ;
        compare1 = ascending1;
        compare2 = (d, x)=>ascending1(f(d), x)
        ;
    }
    function left(a, x, lo = 0, hi = a.length) {
        if (lo < hi) {
            if (compare1(x, x) !== 0) return hi;
            do {
                const mid = lo + hi >>> 1;
                if (compare2(a[mid], x) < 0) lo = mid + 1;
                else hi = mid;
            }while (lo < hi)
        }
        return lo;
    }
    function right(a, x, lo = 0, hi = a.length) {
        if (lo < hi) {
            if (compare1(x, x) !== 0) return hi;
            do {
                const mid = lo + hi >>> 1;
                if (compare2(a[mid], x) <= 0) lo = mid + 1;
                else hi = mid;
            }while (lo < hi)
        }
        return lo;
    }
    function center(a, x, lo = 0, hi = a.length) {
        const i = left(a, x, lo, hi - 1);
        return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
    }
    return {
        left,
        center,
        right
    };
}
function number1(x) {
    return x === null ? NaN : +x;
}
const ascendingBisect = bisector(ascending1);
ascendingBisect.right;
ascendingBisect.left;
bisector(number1).center;
var array1 = Array.prototype;
array1.slice;
var e10 = Math.sqrt(50), e5 = Math.sqrt(10), e2 = Math.sqrt(2);
function tickStep(start, stop, count2) {
    var step0 = Math.abs(stop - start) / Math.max(0, count2), step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)), error = step0 / step1;
    if (error >= e10) step1 *= 10;
    else if (error >= e5) step1 *= 5;
    else if (error >= e2) step1 *= 2;
    return stop < start ? -step1 : step1;
}
shuffler(Math.random);
function shuffler(random) {
    return function shuffle2(array2, i0 = 0, i1 = array2.length) {
        let m = i1 - (i0 = +i0);
        while(m){
            const i = random() * m-- | 0, t = array2[m + i0];
            array2[m + i0] = array2[i + i0];
            array2[i + i0] = t;
        }
        return array2;
    };
}
function formatDecimal(x) {
    return Math.abs(x = Math.round(x)) >= 1000000000000000000000 ? x.toLocaleString("en").replace(/,/g, "") : x.toString(10);
}
function formatDecimalParts(x, p) {
    if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null;
    var i, coefficient = x.slice(0, i);
    return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
    ];
}
function exponent1(x) {
    return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
}
function formatGroup(grouping, thousands) {
    return function(value, width) {
        var i = value.length, t = [], j = 0, g = grouping[0], length = 0;
        while(i > 0 && g > 0){
            if (length + g + 1 > width) g = Math.max(1, width - length);
            t.push(value.substring(i -= g, i + g));
            if ((length += g + 1) > width) break;
            g = grouping[j = (j + 1) % grouping.length];
        }
        return t.reverse().join(thousands);
    };
}
function formatNumerals(numerals) {
    return function(value) {
        return value.replace(/[0-9]/g, function(i) {
            return numerals[+i];
        });
    };
}
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function formatSpecifier(specifier) {
    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
    var match;
    return new FormatSpecifier({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10]
    });
}
formatSpecifier.prototype = FormatSpecifier.prototype;
function FormatSpecifier(specifier) {
    this.fill = specifier.fill === void 0 ? " " : specifier.fill + "";
    this.align = specifier.align === void 0 ? ">" : specifier.align + "";
    this.sign = specifier.sign === void 0 ? "-" : specifier.sign + "";
    this.symbol = specifier.symbol === void 0 ? "" : specifier.symbol + "";
    this.zero = !!specifier.zero;
    this.width = specifier.width === void 0 ? void 0 : +specifier.width;
    this.comma = !!specifier.comma;
    this.precision = specifier.precision === void 0 ? void 0 : +specifier.precision;
    this.trim = !!specifier.trim;
    this.type = specifier.type === void 0 ? "" : specifier.type + "";
}
FormatSpecifier.prototype.toString = function() {
    return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function formatTrim(s) {
    out: for(var n = s.length, i = 1, i0 = -1, i1; i < n; ++i){
        switch(s[i]){
            case ".":
                i0 = i1 = i;
                break;
            case "0":
                if (i0 === 0) i0 = i;
                i1 = i;
                break;
            default:
                if (!+s[i]) break out;
                if (i0 > 0) i0 = 0;
                break;
        }
    }
    return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}
var prefixExponent;
function formatPrefixAuto(x, p) {
    var d = formatDecimalParts(x, p);
    if (!d) return x + "";
    var coefficient = d[0], exponent2 = d[1], i = exponent2 - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent2 / 3))) * 3) + 1, n = coefficient.length;
    return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0];
}
function formatRounded(x, p) {
    var d = formatDecimalParts(x, p);
    if (!d) return x + "";
    var coefficient = d[0], exponent2 = d[1];
    return exponent2 < 0 ? "0." + new Array(-exponent2).join("0") + coefficient : coefficient.length > exponent2 + 1 ? coefficient.slice(0, exponent2 + 1) + "." + coefficient.slice(exponent2 + 1) : coefficient + new Array(exponent2 - coefficient.length + 2).join("0");
}
var formatTypes = {
    "%": (x, p)=>(x * 100).toFixed(p)
    ,
    b: (x)=>Math.round(x).toString(2)
    ,
    c: (x)=>x + ""
    ,
    d: formatDecimal,
    e: (x, p)=>x.toExponential(p)
    ,
    f: (x, p)=>x.toFixed(p)
    ,
    g: (x, p)=>x.toPrecision(p)
    ,
    o: (x)=>Math.round(x).toString(8)
    ,
    p: (x, p)=>formatRounded(x * 100, p)
    ,
    r: formatRounded,
    s: formatPrefixAuto,
    X: (x)=>Math.round(x).toString(16).toUpperCase()
    ,
    x: (x)=>Math.round(x).toString(16)
};
function identity1(x) {
    return x;
}
var map = Array.prototype.map, prefixes = [
    "y",
    "z",
    "a",
    "f",
    "p",
    "n",
    "\xB5",
    "m",
    "",
    "k",
    "M",
    "G",
    "T",
    "P",
    "E",
    "Z",
    "Y"
];
function formatLocale(locale2) {
    var group = locale2.grouping === void 0 || locale2.thousands === void 0 ? identity1 : formatGroup(map.call(locale2.grouping, Number), locale2.thousands + ""), currencyPrefix = locale2.currency === void 0 ? "" : locale2.currency[0] + "", currencySuffix = locale2.currency === void 0 ? "" : locale2.currency[1] + "", decimal = locale2.decimal === void 0 ? "." : locale2.decimal + "", numerals = locale2.numerals === void 0 ? identity1 : formatNumerals(map.call(locale2.numerals, String)), percent = locale2.percent === void 0 ? "%" : locale2.percent + "", minus = locale2.minus === void 0 ? "\u2212" : locale2.minus + "", nan = locale2.nan === void 0 ? "NaN" : locale2.nan + "";
    function newFormat(specifier) {
        specifier = formatSpecifier(specifier);
        var fill = specifier.fill, align = specifier.align, sign = specifier.sign, symbol = specifier.symbol, zero = specifier.zero, width = specifier.width, comma = specifier.comma, precision = specifier.precision, trim = specifier.trim, type = specifier.type;
        if (type === "n") comma = true, type = "g";
        else if (!formatTypes[type]) precision === void 0 && (precision = 12), trim = true, type = "g";
        if (zero || fill === "0" && align === "=") zero = true, fill = "0", align = "=";
        var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "", suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";
        var formatType = formatTypes[type], maybeSuffix = /[defgprs%]/.test(type);
        precision = precision === void 0 ? 6 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));
        function format2(value) {
            var valuePrefix = prefix, valueSuffix = suffix, i, n, c;
            if (type === "c") {
                valueSuffix = formatType(value) + valueSuffix;
                value = "";
            } else {
                value = +value;
                var valueNegative = value < 0 || 1 / value < 0;
                value = isNaN(value) ? nan : formatType(Math.abs(value), precision);
                if (trim) value = formatTrim(value);
                if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;
                valuePrefix = (valueNegative ? sign === "(" ? sign : minus : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
                valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");
                if (maybeSuffix) {
                    i = -1, n = value.length;
                    while(++i < n){
                        if (c = value.charCodeAt(i), 48 > c || c > 57) {
                            valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                            value = value.slice(0, i);
                            break;
                        }
                    }
                }
            }
            if (comma && !zero) value = group(value, Infinity);
            var length = valuePrefix.length + value.length + valueSuffix.length, padding = length < width ? new Array(width - length + 1).join(fill) : "";
            if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";
            switch(align){
                case "<":
                    value = valuePrefix + value + valueSuffix + padding;
                    break;
                case "=":
                    value = valuePrefix + padding + value + valueSuffix;
                    break;
                case "^":
                    value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
                    break;
                default:
                    value = padding + valuePrefix + value + valueSuffix;
                    break;
            }
            return numerals(value);
        }
        format2.toString = function() {
            return specifier + "";
        };
        return format2;
    }
    function formatPrefix2(specifier, value) {
        var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)), e = Math.max(-8, Math.min(8, Math.floor(exponent1(value) / 3))) * 3, k = Math.pow(10, -e), prefix = prefixes[8 + e / 3];
        return function(value2) {
            return f(k * value2) + prefix;
        };
    }
    return {
        format: newFormat,
        formatPrefix: formatPrefix2
    };
}
var locale;
var format;
var formatPrefix;
defaultLocale1({
    thousands: ",",
    grouping: [
        3
    ],
    currency: [
        "$",
        ""
    ]
});
function defaultLocale1(definition) {
    locale = formatLocale(definition);
    format = locale.format;
    formatPrefix = locale.formatPrefix;
    return locale;
}
var t01 = new Date(), t11 = new Date();
function newInterval(floori, offseti, count, field) {
    function interval(date) {
        return floori(date = arguments.length === 0 ? new Date() : new Date(+date)), date;
    }
    interval.floor = function(date) {
        return floori(date = new Date(+date)), date;
    };
    interval.ceil = function(date) {
        return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
    };
    interval.round = function(date) {
        var d0 = interval(date), d1 = interval.ceil(date);
        return date - d0 < d1 - date ? d0 : d1;
    };
    interval.offset = function(date, step) {
        return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
    };
    interval.range = function(start, stop, step) {
        var range = [], previous;
        start = interval.ceil(start);
        step = step == null ? 1 : Math.floor(step);
        if (!(start < stop) || !(step > 0)) return range;
        do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
        while (previous < start && start < stop)
        return range;
    };
    interval.filter = function(test) {
        return newInterval(function(date) {
            if (date >= date) while(floori(date), !test(date))date.setTime(date - 1);
        }, function(date, step) {
            if (date >= date) {
                if (step < 0) while(++step <= 0){
                    while(offseti(date, -1), !test(date)){
                    }
                }
                else while(--step >= 0){
                    while(offseti(date, 1), !test(date)){
                    }
                }
            }
        });
    };
    if (count) {
        interval.count = function(start, end) {
            t01.setTime(+start), t11.setTime(+end);
            floori(t01), floori(t11);
            return Math.floor(count(t01, t11));
        };
        interval.every = function(step) {
            step = Math.floor(step);
            return !isFinite(step) || !(step > 0) ? null : !(step > 1) ? interval : interval.filter(field ? function(d) {
                return field(d) % step === 0;
            } : function(d) {
                return interval.count(0, d) % step === 0;
            });
        };
    }
    return interval;
}
var millisecond = newInterval(function() {
}, function(date, step) {
    date.setTime(+date + step);
}, function(start, end) {
    return end - start;
});
millisecond.every = function(k) {
    k = Math.floor(k);
    if (!isFinite(k) || !(k > 0)) return null;
    if (!(k > 1)) return millisecond;
    return newInterval(function(date) {
        date.setTime(Math.floor(date / k) * k);
    }, function(date, step) {
        date.setTime(+date + step * k);
    }, function(start, end) {
        return (end - start) / k;
    });
};
millisecond.range;
const durationMinute = 1000 * 60;
const durationHour = durationMinute * 60;
const durationDay = durationHour * 24;
const durationWeek = durationDay * 7;
const durationMonth = durationDay * 30;
const durationYear = durationDay * 365;
var second = newInterval(function(date) {
    date.setTime(date - date.getMilliseconds());
}, function(date, step) {
    date.setTime(+date + step * 1000);
}, function(start, end) {
    return (end - start) / 1000;
}, function(date) {
    return date.getUTCSeconds();
});
second.range;
var minute = newInterval(function(date) {
    date.setTime(date - date.getMilliseconds() - date.getSeconds() * 1000);
}, function(date, step) {
    date.setTime(+date + step * durationMinute);
}, function(start, end) {
    return (end - start) / durationMinute;
}, function(date) {
    return date.getMinutes();
});
minute.range;
var hour = newInterval(function(date) {
    date.setTime(date - date.getMilliseconds() - date.getSeconds() * 1000 - date.getMinutes() * durationMinute);
}, function(date, step) {
    date.setTime(+date + step * durationHour);
}, function(start, end) {
    return (end - start) / durationHour;
}, function(date) {
    return date.getHours();
});
hour.range;
var day = newInterval((date)=>date.setHours(0, 0, 0, 0)
, (date, step)=>date.setDate(date.getDate() + step)
, (start, end)=>(end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay
, (date)=>date.getDate() - 1
);
day.range;
function weekday(i) {
    return newInterval(function(date) {
        date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
        date.setHours(0, 0, 0, 0);
    }, function(date, step) {
        date.setDate(date.getDate() + step * 7);
    }, function(start, end) {
        return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
    });
}
var sunday = weekday(0);
var monday = weekday(1);
var tuesday = weekday(2);
var wednesday = weekday(3);
var thursday = weekday(4);
var friday = weekday(5);
var saturday = weekday(6);
sunday.range;
monday.range;
tuesday.range;
wednesday.range;
thursday.range;
friday.range;
saturday.range;
var month = newInterval(function(date) {
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
}, function(date, step) {
    date.setMonth(date.getMonth() + step);
}, function(start, end) {
    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, function(date) {
    return date.getMonth();
});
month.range;
var year = newInterval(function(date) {
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
}, function(date, step) {
    date.setFullYear(date.getFullYear() + step);
}, function(start, end) {
    return end.getFullYear() - start.getFullYear();
}, function(date) {
    return date.getFullYear();
});
year.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
        date.setFullYear(Math.floor(date.getFullYear() / k) * k);
        date.setMonth(0, 1);
        date.setHours(0, 0, 0, 0);
    }, function(date, step) {
        date.setFullYear(date.getFullYear() + step * k);
    });
};
year.range;
var utcMinute = newInterval(function(date) {
    date.setUTCSeconds(0, 0);
}, function(date, step) {
    date.setTime(+date + step * durationMinute);
}, function(start, end) {
    return (end - start) / durationMinute;
}, function(date) {
    return date.getUTCMinutes();
});
utcMinute.range;
var utcHour = newInterval(function(date) {
    date.setUTCMinutes(0, 0, 0);
}, function(date, step) {
    date.setTime(+date + step * durationHour);
}, function(start, end) {
    return (end - start) / durationHour;
}, function(date) {
    return date.getUTCHours();
});
utcHour.range;
var utcDay = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step);
}, function(start, end) {
    return (end - start) / durationDay;
}, function(date) {
    return date.getUTCDate() - 1;
});
utcDay.range;
function utcWeekday(i) {
    return newInterval(function(date) {
        date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
        date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
        date.setUTCDate(date.getUTCDate() + step * 7);
    }, function(start, end) {
        return (end - start) / durationWeek;
    });
}
var utcSunday = utcWeekday(0);
var utcMonday = utcWeekday(1);
var utcTuesday = utcWeekday(2);
var utcWednesday = utcWeekday(3);
var utcThursday = utcWeekday(4);
var utcFriday = utcWeekday(5);
var utcSaturday = utcWeekday(6);
utcSunday.range;
utcMonday.range;
utcTuesday.range;
utcWednesday.range;
utcThursday.range;
utcFriday.range;
utcSaturday.range;
var utcMonth = newInterval(function(date) {
    date.setUTCDate(1);
    date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
    date.setUTCMonth(date.getUTCMonth() + step);
}, function(start, end) {
    return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, function(date) {
    return date.getUTCMonth();
});
utcMonth.range;
var utcYear = newInterval(function(date) {
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step);
}, function(start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
}, function(date) {
    return date.getUTCFullYear();
});
utcYear.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
        date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
        date.setUTCMonth(0, 1);
        date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
        date.setUTCFullYear(date.getUTCFullYear() + step * k);
    });
};
utcYear.range;
function ticker(year2, month2, week, day2, hour2, minute2) {
    const tickIntervals = [
        [
            second,
            1,
            1000
        ],
        [
            second,
            5,
            5 * 1000
        ],
        [
            second,
            15,
            15 * 1000
        ],
        [
            second,
            30,
            30 * 1000
        ],
        [
            minute2,
            1,
            durationMinute
        ],
        [
            minute2,
            5,
            5 * durationMinute
        ],
        [
            minute2,
            15,
            15 * durationMinute
        ],
        [
            minute2,
            30,
            30 * durationMinute
        ],
        [
            hour2,
            1,
            durationHour
        ],
        [
            hour2,
            3,
            3 * durationHour
        ],
        [
            hour2,
            6,
            6 * durationHour
        ],
        [
            hour2,
            12,
            12 * durationHour
        ],
        [
            day2,
            1,
            durationDay
        ],
        [
            day2,
            2,
            2 * durationDay
        ],
        [
            week,
            1,
            durationWeek
        ],
        [
            month2,
            1,
            durationMonth
        ],
        [
            month2,
            3,
            3 * durationMonth
        ],
        [
            year2,
            1,
            durationYear
        ]
    ];
    function ticks(start, stop, count) {
        const reverse = stop < start;
        if (reverse) [start, stop] = [
            stop,
            start
        ];
        const interval = count && typeof count.range === "function" ? count : tickInterval(start, stop, count);
        const ticks2 = interval ? interval.range(start, +stop + 1) : [];
        return reverse ? ticks2.reverse() : ticks2;
    }
    function tickInterval(start, stop, count) {
        const target = Math.abs(stop - start) / count;
        const i = bisector(([, , step2])=>step2
        ).right(tickIntervals, target);
        if (i === tickIntervals.length) return year2.every(tickStep(start / durationYear, stop / durationYear, count));
        if (i === 0) return millisecond.every(Math.max(tickStep(start, stop, count), 1));
        const [t, step] = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
        return t.every(step);
    }
    return [
        ticks,
        tickInterval
    ];
}
const [utcTicks, utcTickInterval] = ticker(utcYear, utcMonth, utcSunday, utcDay, utcHour, utcMinute);
const [timeTicks, timeTickInterval] = ticker(year, month, sunday, day, hour, minute);
function localDate(d) {
    if (0 <= d.y && d.y < 100) {
        var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
        date.setFullYear(d.y);
        return date;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}
function utcDate(d) {
    if (0 <= d.y && d.y < 100) {
        var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
        date.setUTCFullYear(d.y);
        return date;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}
function newDate(y, m, d) {
    return {
        y,
        m,
        d,
        H: 0,
        M: 0,
        S: 0,
        L: 0
    };
}
function formatLocale1(locale2) {
    var locale_dateTime = locale2.dateTime, locale_date = locale2.date, locale_time = locale2.time, locale_periods = locale2.periods, locale_weekdays = locale2.days, locale_shortWeekdays = locale2.shortDays, locale_months = locale2.months, locale_shortMonths = locale2.shortMonths;
    var periodRe = formatRe(locale_periods), periodLookup = formatLookup(locale_periods), weekdayRe = formatRe(locale_weekdays), weekdayLookup = formatLookup(locale_weekdays), shortWeekdayRe = formatRe(locale_shortWeekdays), shortWeekdayLookup = formatLookup(locale_shortWeekdays), monthRe = formatRe(locale_months), monthLookup = formatLookup(locale_months), shortMonthRe = formatRe(locale_shortMonths), shortMonthLookup = formatLookup(locale_shortMonths);
    var formats = {
        a: formatShortWeekday,
        A: formatWeekday,
        b: formatShortMonth,
        B: formatMonth,
        c: null,
        d: formatDayOfMonth,
        e: formatDayOfMonth,
        f: formatMicroseconds,
        g: formatYearISO,
        G: formatFullYearISO,
        H: formatHour24,
        I: formatHour12,
        j: formatDayOfYear,
        L: formatMilliseconds,
        m: formatMonthNumber,
        M: formatMinutes,
        p: formatPeriod,
        q: formatQuarter,
        Q: formatUnixTimestamp,
        s: formatUnixTimestampSeconds,
        S: formatSeconds,
        u: formatWeekdayNumberMonday,
        U: formatWeekNumberSunday,
        V: formatWeekNumberISO,
        w: formatWeekdayNumberSunday,
        W: formatWeekNumberMonday,
        x: null,
        X: null,
        y: formatYear,
        Y: formatFullYear,
        Z: formatZone,
        "%": formatLiteralPercent
    };
    var utcFormats = {
        a: formatUTCShortWeekday,
        A: formatUTCWeekday,
        b: formatUTCShortMonth,
        B: formatUTCMonth,
        c: null,
        d: formatUTCDayOfMonth,
        e: formatUTCDayOfMonth,
        f: formatUTCMicroseconds,
        g: formatUTCYearISO,
        G: formatUTCFullYearISO,
        H: formatUTCHour24,
        I: formatUTCHour12,
        j: formatUTCDayOfYear,
        L: formatUTCMilliseconds,
        m: formatUTCMonthNumber,
        M: formatUTCMinutes,
        p: formatUTCPeriod,
        q: formatUTCQuarter,
        Q: formatUnixTimestamp,
        s: formatUnixTimestampSeconds,
        S: formatUTCSeconds,
        u: formatUTCWeekdayNumberMonday,
        U: formatUTCWeekNumberSunday,
        V: formatUTCWeekNumberISO,
        w: formatUTCWeekdayNumberSunday,
        W: formatUTCWeekNumberMonday,
        x: null,
        X: null,
        y: formatUTCYear,
        Y: formatUTCFullYear,
        Z: formatUTCZone,
        "%": formatLiteralPercent
    };
    var parses = {
        a: parseShortWeekday,
        A: parseWeekday,
        b: parseShortMonth,
        B: parseMonth,
        c: parseLocaleDateTime,
        d: parseDayOfMonth,
        e: parseDayOfMonth,
        f: parseMicroseconds,
        g: parseYear,
        G: parseFullYear,
        H: parseHour24,
        I: parseHour24,
        j: parseDayOfYear,
        L: parseMilliseconds,
        m: parseMonthNumber,
        M: parseMinutes,
        p: parsePeriod,
        q: parseQuarter,
        Q: parseUnixTimestamp,
        s: parseUnixTimestampSeconds,
        S: parseSeconds,
        u: parseWeekdayNumberMonday,
        U: parseWeekNumberSunday,
        V: parseWeekNumberISO,
        w: parseWeekdayNumberSunday,
        W: parseWeekNumberMonday,
        x: parseLocaleDate,
        X: parseLocaleTime,
        y: parseYear,
        Y: parseFullYear,
        Z: parseZone,
        "%": parseLiteralPercent
    };
    formats.x = newFormat(locale_date, formats);
    formats.X = newFormat(locale_time, formats);
    formats.c = newFormat(locale_dateTime, formats);
    utcFormats.x = newFormat(locale_date, utcFormats);
    utcFormats.X = newFormat(locale_time, utcFormats);
    utcFormats.c = newFormat(locale_dateTime, utcFormats);
    function newFormat(specifier, formats2) {
        return function(date) {
            var string = [], i = -1, j = 0, n = specifier.length, c, pad2, format;
            if (!(date instanceof Date)) date = new Date(+date);
            while(++i < n){
                if (specifier.charCodeAt(i) === 37) {
                    string.push(specifier.slice(j, i));
                    if ((pad2 = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
                    else pad2 = c === "e" ? " " : "0";
                    if (format = formats2[c]) c = format(date, pad2);
                    string.push(c);
                    j = i + 1;
                }
            }
            string.push(specifier.slice(j, i));
            return string.join("");
        };
    }
    function newParse(specifier, Z) {
        return function(string) {
            var d = newDate(1900, void 0, 1), i = parseSpecifier(d, specifier, string += "", 0), week, day1;
            if (i != string.length) return null;
            if ("Q" in d) return new Date(d.Q);
            if ("s" in d) return new Date(d.s * 1000 + ("L" in d ? d.L : 0));
            if (Z && !("Z" in d)) d.Z = 0;
            if ("p" in d) d.H = d.H % 12 + d.p * 12;
            if (d.m === void 0) d.m = "q" in d ? d.q : 0;
            if ("V" in d) {
                if (d.V < 1 || d.V > 53) return null;
                if (!("w" in d)) d.w = 1;
                if ("Z" in d) {
                    week = utcDate(newDate(d.y, 0, 1)), day1 = week.getUTCDay();
                    week = day1 > 4 || day1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
                    week = utcDay.offset(week, (d.V - 1) * 7);
                    d.y = week.getUTCFullYear();
                    d.m = week.getUTCMonth();
                    d.d = week.getUTCDate() + (d.w + 6) % 7;
                } else {
                    week = localDate(newDate(d.y, 0, 1)), day1 = week.getDay();
                    week = day1 > 4 || day1 === 0 ? monday.ceil(week) : monday(week);
                    week = day.offset(week, (d.V - 1) * 7);
                    d.y = week.getFullYear();
                    d.m = week.getMonth();
                    d.d = week.getDate() + (d.w + 6) % 7;
                }
            } else if ("W" in d || "U" in d) {
                if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
                day1 = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
                d.m = 0;
                d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day1 + 5) % 7 : d.w + d.U * 7 - (day1 + 6) % 7;
            }
            if ("Z" in d) {
                d.H += d.Z / 100 | 0;
                d.M += d.Z % 100;
                return utcDate(d);
            }
            return localDate(d);
        };
    }
    function parseSpecifier(d, specifier, string, j) {
        var i = 0, n = specifier.length, m = string.length, c, parse;
        while(i < n){
            if (j >= m) return -1;
            c = specifier.charCodeAt(i++);
            if (c === 37) {
                c = specifier.charAt(i++);
                parse = parses[c in pads ? specifier.charAt(i++) : c];
                if (!parse || (j = parse(d, string, j)) < 0) return -1;
            } else if (c != string.charCodeAt(j++)) {
                return -1;
            }
        }
        return j;
    }
    function parsePeriod(d, string, i) {
        var n = periodRe.exec(string.slice(i));
        return n ? (d.p = periodLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function parseShortWeekday(d, string, i) {
        var n = shortWeekdayRe.exec(string.slice(i));
        return n ? (d.w = shortWeekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function parseWeekday(d, string, i) {
        var n = weekdayRe.exec(string.slice(i));
        return n ? (d.w = weekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function parseShortMonth(d, string, i) {
        var n = shortMonthRe.exec(string.slice(i));
        return n ? (d.m = shortMonthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function parseMonth(d, string, i) {
        var n = monthRe.exec(string.slice(i));
        return n ? (d.m = monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function parseLocaleDateTime(d, string, i) {
        return parseSpecifier(d, locale_dateTime, string, i);
    }
    function parseLocaleDate(d, string, i) {
        return parseSpecifier(d, locale_date, string, i);
    }
    function parseLocaleTime(d, string, i) {
        return parseSpecifier(d, locale_time, string, i);
    }
    function formatShortWeekday(d) {
        return locale_shortWeekdays[d.getDay()];
    }
    function formatWeekday(d) {
        return locale_weekdays[d.getDay()];
    }
    function formatShortMonth(d) {
        return locale_shortMonths[d.getMonth()];
    }
    function formatMonth(d) {
        return locale_months[d.getMonth()];
    }
    function formatPeriod(d) {
        return locale_periods[+(d.getHours() >= 12)];
    }
    function formatQuarter(d) {
        return 1 + ~~(d.getMonth() / 3);
    }
    function formatUTCShortWeekday(d) {
        return locale_shortWeekdays[d.getUTCDay()];
    }
    function formatUTCWeekday(d) {
        return locale_weekdays[d.getUTCDay()];
    }
    function formatUTCShortMonth(d) {
        return locale_shortMonths[d.getUTCMonth()];
    }
    function formatUTCMonth(d) {
        return locale_months[d.getUTCMonth()];
    }
    function formatUTCPeriod(d) {
        return locale_periods[+(d.getUTCHours() >= 12)];
    }
    function formatUTCQuarter(d) {
        return 1 + ~~(d.getUTCMonth() / 3);
    }
    return {
        format: function(specifier) {
            var f = newFormat(specifier += "", formats);
            f.toString = function() {
                return specifier;
            };
            return f;
        },
        parse: function(specifier) {
            var p = newParse(specifier += "", false);
            p.toString = function() {
                return specifier;
            };
            return p;
        },
        utcFormat: function(specifier) {
            var f = newFormat(specifier += "", utcFormats);
            f.toString = function() {
                return specifier;
            };
            return f;
        },
        utcParse: function(specifier) {
            var p = newParse(specifier += "", true);
            p.toString = function() {
                return specifier;
            };
            return p;
        }
    };
}
var pads = {
    "-": "",
    _: " ",
    "0": "0"
}, numberRe = /^\s*\d+/, percentRe = /^%/, requoteRe = /[\\^$*+?|[\]().{}]/g;
function pad(value, fill, width) {
    var sign = value < 0 ? "-" : "", string = (sign ? -value : value) + "", length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
}
function requote(s) {
    return s.replace(requoteRe, "\\$&");
}
function formatRe(names) {
    return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
}
function formatLookup(names) {
    return new Map(names.map((name, i)=>[
            name.toLowerCase(),
            i
        ]
    ));
}
function parseWeekdayNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.w = +n[0], i + n[0].length) : -1;
}
function parseWeekdayNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.u = +n[0], i + n[0].length) : -1;
}
function parseWeekNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.U = +n[0], i + n[0].length) : -1;
}
function parseWeekNumberISO(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.V = +n[0], i + n[0].length) : -1;
}
function parseWeekNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.W = +n[0], i + n[0].length) : -1;
}
function parseFullYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 4));
    return n ? (d.y = +n[0], i + n[0].length) : -1;
}
function parseYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
}
function parseZone(d, string, i) {
    var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
    return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
}
function parseQuarter(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.q = n[0] * 3 - 3, i + n[0].length) : -1;
}
function parseMonthNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
}
function parseDayOfMonth(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.d = +n[0], i + n[0].length) : -1;
}
function parseDayOfYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
}
function parseHour24(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.H = +n[0], i + n[0].length) : -1;
}
function parseMinutes(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.M = +n[0], i + n[0].length) : -1;
}
function parseSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.S = +n[0], i + n[0].length) : -1;
}
function parseMilliseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.L = +n[0], i + n[0].length) : -1;
}
function parseMicroseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 6));
    return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
}
function parseLiteralPercent(d, string, i) {
    var n = percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
}
function parseUnixTimestamp(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.Q = +n[0], i + n[0].length) : -1;
}
function parseUnixTimestampSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.s = +n[0], i + n[0].length) : -1;
}
function formatDayOfMonth(d, p) {
    return pad(d.getDate(), p, 2);
}
function formatHour24(d, p) {
    return pad(d.getHours(), p, 2);
}
function formatHour12(d, p) {
    return pad(d.getHours() % 12 || 12, p, 2);
}
function formatDayOfYear(d, p) {
    return pad(1 + day.count(year(d), d), p, 3);
}
function formatMilliseconds(d, p) {
    return pad(d.getMilliseconds(), p, 3);
}
function formatMicroseconds(d, p) {
    return formatMilliseconds(d, p) + "000";
}
function formatMonthNumber(d, p) {
    return pad(d.getMonth() + 1, p, 2);
}
function formatMinutes(d, p) {
    return pad(d.getMinutes(), p, 2);
}
function formatSeconds(d, p) {
    return pad(d.getSeconds(), p, 2);
}
function formatWeekdayNumberMonday(d) {
    var day = d.getDay();
    return day === 0 ? 7 : day;
}
function formatWeekNumberSunday(d, p) {
    return pad(sunday.count(year(d) - 1, d), p, 2);
}
function dISO(d) {
    var day = d.getDay();
    return day >= 4 || day === 0 ? thursday(d) : thursday.ceil(d);
}
function formatWeekNumberISO(d, p) {
    d = dISO(d);
    return pad(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
}
function formatWeekdayNumberSunday(d) {
    return d.getDay();
}
function formatWeekNumberMonday(d, p) {
    return pad(monday.count(year(d) - 1, d), p, 2);
}
function formatYear(d, p) {
    return pad(d.getFullYear() % 100, p, 2);
}
function formatYearISO(d, p) {
    d = dISO(d);
    return pad(d.getFullYear() % 100, p, 2);
}
function formatFullYear(d, p) {
    return pad(d.getFullYear() % 10000, p, 4);
}
function formatFullYearISO(d, p) {
    var day = d.getDay();
    d = day >= 4 || day === 0 ? thursday(d) : thursday.ceil(d);
    return pad(d.getFullYear() % 10000, p, 4);
}
function formatZone(d) {
    var z = d.getTimezoneOffset();
    return (z > 0 ? "-" : (z *= -1, "+")) + pad(z / 60 | 0, "0", 2) + pad(z % 60, "0", 2);
}
function formatUTCDayOfMonth(d, p) {
    return pad(d.getUTCDate(), p, 2);
}
function formatUTCHour24(d, p) {
    return pad(d.getUTCHours(), p, 2);
}
function formatUTCHour12(d, p) {
    return pad(d.getUTCHours() % 12 || 12, p, 2);
}
function formatUTCDayOfYear(d, p) {
    return pad(1 + utcDay.count(utcYear(d), d), p, 3);
}
function formatUTCMilliseconds(d, p) {
    return pad(d.getUTCMilliseconds(), p, 3);
}
function formatUTCMicroseconds(d, p) {
    return formatUTCMilliseconds(d, p) + "000";
}
function formatUTCMonthNumber(d, p) {
    return pad(d.getUTCMonth() + 1, p, 2);
}
function formatUTCMinutes(d, p) {
    return pad(d.getUTCMinutes(), p, 2);
}
function formatUTCSeconds(d, p) {
    return pad(d.getUTCSeconds(), p, 2);
}
function formatUTCWeekdayNumberMonday(d) {
    var dow = d.getUTCDay();
    return dow === 0 ? 7 : dow;
}
function formatUTCWeekNumberSunday(d, p) {
    return pad(utcSunday.count(utcYear(d) - 1, d), p, 2);
}
function UTCdISO(d) {
    var day = d.getUTCDay();
    return day >= 4 || day === 0 ? utcThursday(d) : utcThursday.ceil(d);
}
function formatUTCWeekNumberISO(d, p) {
    d = UTCdISO(d);
    return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
}
function formatUTCWeekdayNumberSunday(d) {
    return d.getUTCDay();
}
function formatUTCWeekNumberMonday(d, p) {
    return pad(utcMonday.count(utcYear(d) - 1, d), p, 2);
}
function formatUTCYear(d, p) {
    return pad(d.getUTCFullYear() % 100, p, 2);
}
function formatUTCYearISO(d, p) {
    d = UTCdISO(d);
    return pad(d.getUTCFullYear() % 100, p, 2);
}
function formatUTCFullYear(d, p) {
    return pad(d.getUTCFullYear() % 10000, p, 4);
}
function formatUTCFullYearISO(d, p) {
    var day = d.getUTCDay();
    d = day >= 4 || day === 0 ? utcThursday(d) : utcThursday.ceil(d);
    return pad(d.getUTCFullYear() % 10000, p, 4);
}
function formatUTCZone() {
    return "+0000";
}
function formatLiteralPercent() {
    return "%";
}
function formatUnixTimestamp(d) {
    return +d;
}
function formatUnixTimestampSeconds(d) {
    return Math.floor(+d / 1000);
}
var locale1;
var timeFormat;
var timeParse;
var utcFormat;
var utcParse;
defaultLocale2({
    dateTime: "%x, %X",
    date: "%-m/%-d/%Y",
    time: "%-I:%M:%S %p",
    periods: [
        "AM",
        "PM"
    ],
    days: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ],
    shortDays: [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ],
    months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ],
    shortMonths: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ]
});
function defaultLocale2(definition) {
    locale1 = formatLocale1(definition);
    timeFormat = locale1.format;
    timeParse = locale1.parse;
    utcFormat = locale1.utcFormat;
    utcParse = locale1.utcParse;
    return locale1;
}
var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";
function formatIsoNative(date) {
    return date.toISOString();
}
Date.prototype.toISOString ? formatIsoNative : utcFormat(isoSpecifier);
function parseIsoNative(string) {
    var date = new Date(string);
    return isNaN(date) ? null : date;
}
+new Date("2000-01-01T00:00:00.000Z") ? parseIsoNative : utcParse(isoSpecifier);
function initRange(domain, range2) {
    switch(arguments.length){
        case 0:
            break;
        case 1:
            this.range(domain);
            break;
        default:
            this.range(range2).domain(domain);
            break;
    }
    return this;
}
const implicit = Symbol("implicit");
function ordinal() {
    var index = new InternMap(), domain = [], range2 = [], unknown = implicit;
    function scale(d) {
        let i = index.get(d);
        if (i === void 0) {
            if (unknown !== implicit) return unknown;
            index.set(d, i = domain.push(d) - 1);
        }
        return range2[i % range2.length];
    }
    scale.domain = function(_) {
        if (!arguments.length) return domain.slice();
        domain = [], index = new InternMap();
        for (const value of _){
            if (index.has(value)) continue;
            index.set(value, domain.push(value) - 1);
        }
        return scale;
    };
    scale.range = function(_) {
        return arguments.length ? (range2 = Array.from(_), scale) : range2.slice();
    };
    scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
    };
    scale.copy = function() {
        return ordinal(domain, range2).unknown(unknown);
    };
    initRange.apply(scale, arguments);
    return scale;
}
const svg = create("svg").attr("viewBox", [
    0,
    0,
    width,
    height
].join(" "));
const scale = ordinal(category10);
const isNode = (n)=>typeof n !== "string"
;
svg.append("g").attr("class", "folders").selectAll("text").data(folders).join("text").text((d)=>d
).attr("font-size", 10).attr("text-anchor", "middle").attr("y", 540).attr("x", (d)=>xOrigin(folders.indexOf(d))
);
const linkGroup = svg.append("g").attr("class", "links").attr("stroke", "#999").attr("stroke-opacity", 0.6);
const nodeGroup = svg.append("g").attr("class", "nodes");
transition();
const radius = (d)=>Math.sqrt(d.imports + 1) * 3 + 4
;
const simulation1 = simulation().force("link", link().id((n)=>n.id
).strength(0)).force("collide", collide((d)=>radius(d) + 6
)).force("x", x$2().x((n)=>xOrigin(n.folder)
).strength(0.06)).force("y", y$2().y((n)=>yOrigin(n.imports)
).strength(0.06));
const updateSimulationData = (data)=>{
    const { nodes , links  } = data;
    const oldNodes = simulation1.nodes();
    oldNodes.forEach((oldNode)=>{
        const newNode = nodes.find((n)=>n.id == oldNode.id
        );
        if (!newNode) return;
        newNode.x = oldNode.x;
        newNode.y = oldNode.y;
        oldNode.group !== newNode.group ? newNode.converted = true : newNode.converted = false;
    });
    simulation1.nodes(nodes);
    simulation1.force("link")?.links(links);
    simulation1.alpha(0.3).restart();
    return simulation1;
};
const dragging = (simulation)=>{
    const dragStarted = (event)=>{
        if (!event.active) simulation.alphaTarget(0.1).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    };
    const dragged = (event)=>{
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    };
    const dragEnded = (event)=>{
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    };
    return drag().on("start", dragStarted).on("drag", dragged).on("end", dragEnded);
};
const updateSvgData = (data, simulation)=>{
    const { links , nodes  } = data;
    const link = linkGroup.selectAll("line").data(links, (d)=>{
        const s = isNode(d.source) ? d.source.id : d.source;
        const t = isNode(d.target) ? d.target.id : d.target;
        return `${s}--${t}`;
    }).join((enter)=>enter.append("line").attr("stroke-width", 4).call((t)=>t.transition().duration(450).attr("stroke-width", (l)=>l.value ?? null
            )
        )
    );
    link.exit().remove();
    const node = nodeGroup.selectAll("g").data(nodes, (d)=>d.id
    ).join((enter)=>{
        const newNode = enter.append("g").attr("fill", "purple").call((n)=>n.transition().duration(600).attr("fill", (d)=>scale(String(d.group))
            )
        ).attr("data-imports", (d)=>d.imports
        ).attr("data-origin", (d)=>`${xOrigin(d.imports)},${yOrigin(d.imports)}`
        ).call(dragging(simulation));
        newNode.append("circle").attr("stroke", "#fff").attr("cx", 0).attr("cy", 0).attr("r", radius);
        newNode.append("title").text((d)=>d.id
        );
        newNode.append("text").text((d)=>{
            return d.id.split("/").slice(-1)[0].split("-").map((t)=>t.substring(0, 1)
            ).join("");
        }).attr("pointer-events", "none").attr("font-size", 8).attr("fill", "white").attr("text-anchor", "middle").attr("x", 0).attr("y", 2);
        newNode.append("text").text((d)=>d.id.split("/").slice(-1)[0]
        ).attr("pointer-events", "none").attr("font-size", 9).attr("x", (d)=>Math.sqrt(d.imports + 1) * 3 + 5
        ).attr("y", 3).attr("class", "label");
        return newNode;
    }, (update)=>{
        update.attr("fill", (d)=>scale(String(d.group))
        );
        update.select("circle").attr("r", radius);
        const updatedNodes = update.filter((d)=>d.converted ?? false
        );
        updatedNodes.select("circle").attr("transform", "scale(4)").call((c)=>c.transition().duration(600).attr("transform", "scale(1)")
        );
        return update.merge(updatedNodes);
    }, (exit)=>exit.remove()
    );
    node.on("mouseover", (_, n)=>{
        svg.attr("class", "hover");
        link.attr("stroke-width", (l)=>{
            return n === l.source ? 1.2 : n === l.target ? 1 : 0;
        }).style("stroke-dasharray", (l)=>{
            return n === l.target ? "5 3" : null;
        });
        const linked = (d)=>{
            const linked = links.filter((l)=>l.source === n || l.target === n
            ).some((l)=>l.source === d || l.target === d
            );
            return d === n || linked;
        };
        node.attr("class", (d)=>linked(d) ? "active" : null
        );
    });
    node.on("mouseout", ()=>{
        svg.attr("class", null);
        link.attr("stroke-width", (l)=>l.value ?? null
        ).style("stroke-dasharray", null);
        node.attr("class", null).style("opacity", null);
    });
    simulation.on("tick", ()=>{
        link.attr("x1", (l)=>(isNode(l.source) && l.source.x) ?? 0
        ).attr("y1", (l)=>(isNode(l.source) && l.source.y) ?? 0
        ).attr("x2", (l)=>(isNode(l.target) && l.target.x) ?? 0
        ).attr("y2", (l)=>(isNode(l.target) && l.target.y) ?? 0
        );
        node.attr("transform", (d)=>`translate(${d.x}, ${d.y})`
        );
    });
};
const directedGraph = document.querySelector("#directed-graph");
const fragment = document.createDocumentFragment();
const hashes = [
    "287ac0a948594e2f95d0fe0e5791d6dce959456c",
    "7b5644d4cd64b44e7ba6f6936805fd54867adefb",
    "525e8ede60bafb0e39fbbe1c0c58c172da5902e5",
    "62797775c74d1bd9816de5462d0f4c4fee056913",
    "2e82565dec2bf3d837536833b97e0813702796a9",
    "c789dda9024cdcb62d77eea8e47cbf51f5e7826f",
    "7282823f3d8c10c4b6eee9c87ba62560bb6392db",
    "8908ed8fe13dc468a9738545009e7e6b92ea567b",
    "ceaab828fb7e851c0413cbbe4f709eeaf7f7b4f7",
    "12bebb6d991ecb93335241932a58753c68406055",
    "633744df8396c01ebc93b5fab90e64dfb6793a2a",
    "edafeadc33d0b1ad17b91e2055232e62252c713d",
    "a03cf57de93c0a789e78ee9cba90471a217ca5c6",
    "main", 
];
const updateGraph = async (hash)=>{
    const data = await getDataForHash(hash);
    const simulation = updateSimulationData(data);
    updateSvgData(data, simulation);
};
updateGraph("main");
for (const hash of hashes){
    const button = document.createElement("button");
    button.innerText = hash.substring(0, 6);
    fragment.appendChild(button);
    button.addEventListener("click", ()=>{
        updateGraph(hash);
    });
}
if (directedGraph) {
    const node = svg.node();
    node && directedGraph.appendChild(node);
    directedGraph.appendChild(fragment);
}
const largeFilesList = document.querySelector("#largest-files");
fetch("/build/largest-files.json").then((r)=>r.json()
).then((files)=>{
    files.forEach((file)=>{
        const [size, path] = file;
        const li = document.createElement("li");
        li.textContent = `${(size / 1000).toFixed(2)}kB : ${path}`;
        largeFilesList?.appendChild(li);
    });
});
