var wheel = {};
wheel.events = [];
wheel.refs = {};

wheel.findNode = function(nodeName) {
    return document.getElementById(wheel.refs[nodeName]);
}

wheel.registerEvents = function() {
    for (i in wheel.events) {
        var event = wheel.events[i];
        var element = document.getElementById(event.id);
        if (element) {
            element.addEventListener(event.key, function(e) {
                event.event(e, this);
            });
        };
    }
    wheel.events = [];
}

function BaseComponent() {}

BaseComponent.prototype.bindAll = function() {}

BaseComponent.prototype.initialize = function (props, nodes) {
    this.props = props?props:{};
    this.nodes = nodes;

    this.bindAll();

    if (checkType(this.init, "Function")) {
        this.init();
    }
}

BaseComponent.prototype.update = function () {
    var currentNode = document.getElementById(this.props.id);
    this.render();
    currentNode.outerHTML= this.html;
    wheel.registerEvents();
}

BaseComponent.prototype.render = function () {
    var obj = wheel.render(this.jml());
    this.props.id = obj.props.id;

    this.html = obj.html;
    return this;
}

BaseComponent.prototype.randomId = function() {
    this.props.id = Math.random();
    return this.elementId;
}

wheel.newClass = function (nodes, dontBind) {
    function NewComponet() {};
    NewComponet.prototype = new BaseComponent(); 

    for (key in nodes) {
        NewComponet.prototype[key] = nodes[key];
    }

    if (!dontBind) {
        NewComponet.prototype.bindAll = function () {
            for (key in NewComponet.prototype) {
                if (checkType(NewComponet.prototype[key],"Function")) {
                    this[key] = NewComponet.prototype[key].bind(this);
                }
            }
        }
    };
    
    return NewComponet;
}

var StringComponent = wheel.newClass({
    render: function() {
        this.randomId();
        if (this.props.ref) {
            wheel.refs[this.props.ref] = this.props.id;
        };

        var html="";

        for (key in this.nodes) {
            var obj = wheel.render(this.nodes[key]);

            if (this.nodes.length>1) {
                html+="\n"+addTabForEachLine(obj.html || obj);
            } else {
                html+= obj.html || obj;
            }
        }

        html+=this.nodes.length>1?"\n":"";
        this.html= tag(this.tag, this.props)+html+tag(this.tag, {}, true); 
        return this;
    }
}, true);

function checkType(object) {
    var objectTypeName = toString.apply(object).replace("]","").split(" ")[1];
    var types = Array.prototype.slice.call(arguments).slice(1);

    return (types.indexOf(objectTypeName)>=0);
}

function tag(component, props, isTail) {   
    var pstr = "";
    for (key in props) {
        if (checkType(props[key], "Function")) {
            wheel.events.push({id:props.id, key:key, event:props[key]});
            continue;
        }
        pstr += " "+key+"=\""+props[key]+"\"";
    }

    return "<"+(isTail?"/":"")+String(component)+pstr+">";
}

function addTabForEachLine(text) {
    return text.split("\n").map(function(line) {
        return "    "+line;
    }).join("\n");
}

wheel.renderToString = function (jml) {
    var obj = wheel.render(jml);
    return obj.html;
}

wheel.renderFor = function (elementId, jml) {
    var obj = wheel.render(jml);
    document.getElementById(elementId).outerHTML = obj.html;
    wheel.registerEvents();
}

wheel.render = function (jml) {
    if (!jml) return "";
    if (checkType(jml,'String','Number')) {
        return jml;
    }

    var tag = jml[0];
    var props, nodes;

    if  (jml.length>1 && checkType(jml[1], 'Object')) {
        props = jml[1];
        nodes = jml.slice(2);
    } else {
        props = {};
        nodes = jml.slice(1) || [];
    }

    var component;

    if (checkType(tag, 'String')) {
        component = new StringComponent();
        component.tag = tag;
    } else {
        component = new tag();
    }

    component.initialize(props, nodes);

    return component.render();
}