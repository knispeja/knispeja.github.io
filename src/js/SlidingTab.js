// Class defining a sliding tab
function SlidingTab(img)
{
	this.outtimer;
	this.intimer;
	
	this.left = 0;
	this.interval = 6;
	this.animatingout = false;
	this.animatingin = false;
	this.increment = 5;
	this.extenddist = 50;
	this.imgobj = img;
	
	this.taboutloop = function(){
		this.animatingout = true;
		this.left = parseInt(this.imgobj.style.left);
	
		if(this.left < this.extenddist)
		{
			this.imgobj.style.left = this.left + this.increment + 'px';
			
			this.outtimer = setTimeout(this.taboutloop.bind(this), this.interval);
		}
		else
		{
			this.animatingout = false;
		}
	};
	
	this.shifttabout = function(){
		if(this.animatingin)
		{
			this.animatingin = false;
			clearTimeout(this.intimer);
		}
		if(!this.animatingout)
		{
			this.taboutloop();
		}	
	}
	
	this.tabinloop = function(){
		this.animatingin = true;
		this.left = parseInt(this.imgobj.style.left);
		
		if(this.left > 0)
		{
			this.imgobj.style.left = this.left - this.increment + 'px';
			this.intimer = setTimeout(this.tabinloop.bind(this), this.interval);
		}
		else
		{
			this.animatingin = false;
		}
	}
	
	this.shifttabin = function(){
		if(this.animatingout)
		{
			this.animatingout = false;
			clearTimeout(this.outtimer);
		}
		if(!this.animatingin)
		{
			this.tabinloop();
		}
	}
	
	this.init = function(){
		this.imgobj.style.position = 'relative';
		this.imgobj.style.left = '0px';
		
		this.imgobj.onmouseover=this.shifttabout.bind(this);
		this.imgobj.onmouseout=this.shifttabin.bind(this);
	}
	
	this.init();
}