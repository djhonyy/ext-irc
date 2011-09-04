/**
 * @class Ext.Error
 * @extends Object
 * <p>The Ext.Error class wraps the native Javascript Error class similar to how Ext.Element wraps a DomNode.
 * To display an error to the client call the {@link #toConsole} method which will check for the
 * existence of Firebug.</p>
 *
 * TODO: Move to Ext.js?
 *
<code><pre>
try {
    generateError({
        foo: 'bar'
    });
}
catch (e) {
    e.toConsole();
}
function generateError(data) {
    throw new Ext.Error('foo-error', 'Foo.js', data);
}

</pre></code>
 * @param {String} id A simple label for the error for lookup.
 * @param {String} file The file where the error occurred.
 * @param {Mixed} data context-data.
 */
Ext.Error = function(id, file, data) {
    this.message = this.render.apply(this, arguments);
    this.error = new Error(this.message, file);
    this.error.name = this.cls;
    this.id = id;
}
Ext.Error.prototype = {
    /**
     * The ClassName of this Error.
     * @property cls
     * @type String
     */
    cls: 'Ext.Error',
    /**
     * The id of the error.
     * @property id
     * @type String
     */
    id : undefined,

    /**
     * Abstract method to render error message.  All Error extensions should override this method.
     */
    render : function(id, file, data) {
       return this.cls + ' ' + id;
    },

    /**
     * Attempts to output the exception info on FireBug console if exists.
     */
    toConsole : function() {
        if (typeof(console) == 'object' && typeof(console.error) == 'function') {
            console.error(this.error);
        }
        else {
            alert("Error: " + this.cls + ' ' + this.message);   // <-- ugh.  fix this before official release.
        }
    },

    /**
     * toString
     */
    toString : function() {
        return this.error.toString();
    }
};

/**
 * Error class for Ext.data.Api errors.
 */
Ext.data.Api.Error = Ext.extend(Ext.Error, {
    cls: 'Ext.data.Api',
    render : function(name, file, data) {
        switch (name) {
            case 'action-url-undefined':
                return 'No fallback url defined for action "' + data + '".  When defining a DataProxy api, please be sure to define an url for each CRUD action in Ext.data.Api.actions or define a default url in addition to your api-configuration.';
            case 'invalid':
                // make sure data is an array so we can call join on it.
                data = (!Ext.isArray(data)) ? [data] : data;
                return 'received an invalid API-configuration "' + data.join(', ') + '".  Please ensure your proxy API-configuration contains only the actions defined in Ext.data.Api.actions';
            case 'invalid-url':
                return 'Invalid url "' + data + '".  Please review your proxy configuration.';
            case 'execute':
                return 'Attempted to execute an unknown action "' + data + '".  Valid API actions are defined in Ext.data.Api.actions"';
            default:
                return 'Unknown Error "' + name + '"';
        }
    }
});