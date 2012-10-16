(function(){
    
    //walk the properties of the cc object
    //and collect the names of classes,
    //and their instance and static methods,
    //and their instance and static properties,
    //as a json string.
    
    //the result is then written to cc.__api__
    
    
    //to use this, run it on two platforms and
    //diff the result with json-diff or similar
    //https://github.com/andreyvit/json-diff
    
    function private_identifier(str){
	//identifiers beginning with '_' or '$'
	//are considered private.
	var ch = str[0];
	return (ch === '_' || ch === '$')
    }

    function starts_with_uppercase(str){
	var ch = str[0];
	return (
	    //filter lowercase and nonalphanumeric
	    (ch !== ch.toLowerCase())
	    //filter ALL_UPPERCASE_NAMES
	    && (str !== str.toUpperCase()));
    }
    
    function classname(k){
	return (starts_with_uppercase(k)
		&& (! private_identifier(k))
		&& (typeof cc[k] === 'function'));
    }

 
    //gather the classnames etc.
    var classnames = [];
    //this holds things on cc which are not
    //class names. it's not reported a the
    //moment, as the output from just the
    //classnames is pretty large. once the
    //flush function can write directly to a file
    //it won't be an issue.
    var other = [];

    
    for (var k in cc) {
	if(classname(k)){
	    classnames.push(k);
	} else {
	    other.push(k);
	};	
    };

    classnames.sort();
    // other.sort(); //unused.


    
    //gather information on the classnames
    
    var classes = {};
    
    classnames.map(function(n){

	
	function ignoreable(k){
	    return ((k === 'constructor')
		    || (private_identifier(k)));
	};
	
	var
	instance_methods = [],
	instance_properties = [],
	static_methods = [],
	static_properties = [];


	//instance info
	var ins = cc[n].prototype;
	
	for(var k in ins){
	    if(!(ignoreable(k))){
		if(typeof ins[k] == 'function'){
		    instance_methods.push(k);
		} else {
		    instance_properties.push(k);
		};
	    };
	};

	instance_methods.sort();
	instance_properties.sort();


	//static info
	for(var k in cc[n]){
	    if(!(ignoreable(k))){
		if(typeof cc[n][k] == 'function'){
		    static_methods.push(k);
		} else {
		    static_properties.push(k);
		};
	    };
	};

	static_methods.sort();
	static_properties.sort();

	//return results with as little
	//noise as possible.
	
	var result = {};
	function empty(o){
	    if (o instanceof Array) {
		return (o.length === 0);
	    } else {
		return empty(Object.keys(o));
	    };
	};
	function maybe_set(obj, prop, val){
	    if(!empty(val)){
		obj[prop] = val;
	    }
	};

	var class_result = {};
	maybe_set(class_result, "methods", static_methods);
	maybe_set(class_result, "properties", static_properties);
	maybe_set(result, "class", class_result);

	var inst_result = {};
	maybe_set(inst_result, "methods", instance_methods);
	maybe_set(inst_result, "properties", instance_properties);
	maybe_set(result, "instance", inst_result);

	//set the result regardless of whether it's empty.
	//if the name was found, that's important by itself.
	classes[n] = result;
    })


    //TODO gather info from the 'other' collection.
    //could be good to have a test for simple property
    //types that can be compared by value and include
    //them as well.
    var properties = {};
    var functions = {}

    cc.__api__ = JSON.stringify(classes);
    
})()
