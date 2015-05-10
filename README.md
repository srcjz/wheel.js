# wheel.js
React.js in less than 200 lines.

# HelloMessage

```javascript

var HelloMessage = wheel.newClass({
    jml: function(){
        return ["div","Hello, ", this.nodes.join(", "), "!"];
    }
});

wheel.renderFor("content", [HelloMessage,"World"]);

```

# Timer

```javascript

var Timer = wheel.newClass({
    init: function() {
        this.secondsElapsed = parseInt(this.nodes[0]);
        var self = this;
        setInterval(function () {
            self.secondsElapsed++;
            self.update();
        }, 1000);
    },
    jml: function() {
        return ["div", "Seconds Elapsed:"+this.secondsElapsed];
    }
});

wheel.renderFor("content", [Timer,0]);

```

# CommentBox

```javascript

var data = [
    {author: "Pete Hunt", text: "This is one comment"},
    {author: "Jordan Walke", text: "This is another comment"}];



var Comment = wheel.newClass({
    jml: function() {
        return ["div",["h2", this.props.author]].concat(this.nodes);
    }
});

var CommentList = wheel.newClass({
    jml: function() {
        var commentNodes = this.props.data.map(function(comment) {
            return [Comment, {author:comment.author}, comment.text];
        });

        return ["div"].concat(commentNodes);
    }
});


var CommentForm = wheel.newClass({
    handleSubmit: function(e, form) {
        e.preventDefault();

        var author = wheel.findNode("author").value.trim();
        var text = wheel.findNode("text").value.trim();

        if (!text || !author) {
            return;
        }

        data.push({author:author,text:text});
    },

    jml: function() {
        return ["div",["br"],
            ["form", {submit:this.handleSubmit},
                ["input",{ref:"author"}],
                ["br"],
                ["textarea",{ref:"text"}],
                ["br"],
                ["button","Submit"]
            ]

        ];
    }
})

var CommentBox = wheel.newClass({
    init: function() {
        var self = this;
        var lastLength = data.length;
        setInterval(function(){
            if (lastLength<data.length) {
                self.update();
                lastLength = data.length;
            };

        }, this.props.pollInterval);
    },
    jml: function() {
        return ["div",["h1", "Comments"],
            [CommentList,{data: this.props.data}],
            [CommentForm]
        ];
    }
});

wheel.renderFor("content", [CommentBox, {data:data, pollInterval:200}]);


```