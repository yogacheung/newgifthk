// implement linked list
// data - data to store in linked list element
// manager - linked list manager which create this element
// id - unique id of element
function LinkedListElement(data, manager, id)
{
    this.prev = null;
    this.next = null;
    this.data = data;
    this.manager = manager;
    this.id = id;

}

// manager, create element, delete element, go thro elements
function LinkedList()
{
    this.begin = null; // points to begin element 
    this.end = null;// points to last not null element
    this.ids = 0;	// unique id of elements, 
    this.elementsCount = 0;	// number of elements in list

    // return number of elements in current list
    this.ElementsCount = function()
    {
	return this.elementsCount;
    }
	
    this.AddElement = function(data)
    {
	var t = new LinkedListElement(data, this, this.ids);
	this.ids += 1;
	 
	if(this.begin === null)
	{
	    // there no begin and end elements
	    this.begin = t;
	    this.end = t;
	}
	else
	{
	    var end = this.end;
	    end.next = t;
	    t.prev = end;
	    this.end = t;
	}

	this.elementsCount += 1;
	return t;
    }

    // clear list (remove all elements from it)
    this.Clear = function()
    {
	var f = this.begin;
	while(f != null)
	{
	    var n = f.next;
	    this.DeleteElement(f);
	    f = n;
	}
    }
	
    // Delete elem from list
    this.DeleteElement = function(elem)
    {
	var p = elem.prev;
	var n = elem.next;
	if(p !== null)
	    p.next = n;
	else
	{
	    // first element
	    this.begin = n; 
	}

	if(n !== null)
	    n.prev = p;
	else
	{
	    // end element
	    this.end = p;
	}

	this.elementsCount -= 1;
    }

    // delete element by data which it contain
    // delete only one element
    this.DeleteByData = function(data)
    {
	var f = this.begin;
	while(f !== null)
	{
	    if(f.data === data)
	    {
		this.DeleteElement(f);
		return;
	    }
	    f = f.next;
	}
    }

    // iterate thru all elements
    // callback - function called for each element, protorype: bool callback(manager, currentElement) - return false if there not need iteration
    this.Iterate = function(callback)
    {
	var f = this.begin;
	while(f !==  null)
	{
	    if(callback !== undefined)
	    {
		if(callback(this, f)=== false)
		    return;
	    }

	    f = f.next;
	}
    }

    // iterate reverce thru all elements
    // callback - function called for each element, protorype: callback(manager, currentElement)
    this.IterateReverce = function(callback)
    {
	var f = this.end;
	while(f != null)
	{
	    if(callback !== undefined)
		callback(this, f);

	    f = f.prev;
	}
    }

    //print all elements in list
    this.debugPrint = function()
    {
	var f = this.begin;
	while(f != null)
	{
	    console.log("data: " +f.data);
	    f = f.next;
	}
    }
}
