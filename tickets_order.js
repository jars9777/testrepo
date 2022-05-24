
		var myHeaders = new Headers();
        myHeaders.append('pragma', 'no-cache');
        myHeaders.append('cache-control', 'no-cache');

		var myInit = {
		method: 'GET',
		headers: myHeaders,
		}		
 
    customElements.define("tickets-order", class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
	
      }
      static get observedAttributes() { return ["loading","items"]; }
      get loading() {
        return JSON.parse(this.getAttribute("loading"));
      }
      set loading(v) {
        this.setAttribute("loading", JSON.stringify(v));
      }

      get planets() {
        return JSON.parse(this.getAttribute("items"));
      }
      set planets(v) {
        this.setAttribute("items", JSON.stringify(v));
      }
	  
	
	
     async fetchPlanets(url) {
     //this.loading=true;
	  try{		
			const response = await fetch(url,myInit);		
			const json = await response.json();	
			this.items = json;
			this.loading = false;
			}
			
		 catch(error){
			console.log("error reading ticket");//Devemos gerar evento para o browser
			}
			
		
      }
	 
      async connectedCallback() {
	  
	 
        this.shadowRoot.addEventListener("click", (event) => {
          const name = event.srcElement.id;
          if (this[name]) {
            this[name]();
          }
        });
		
        await this.fetchPlanets("./ticket.txt",myInit);
		
		/*polling*/
		this.timer = setInterval(() => {
		  if (this.loading==false)  this.fetchPlanets("./ticket.txt",myInit);
        }, 600);
		//this.loading=false;
      }
      disconnectedCallback() {
      }
	i=0;
      attributeChangedCallback(attrName, oldVal, newVal) {
	        
			if(this.loading==false && this.i==0) 
			{console.log("ok");this.render();this.i=this.i+1}
           else this.i=0;
			
      }
      
     
       render() {
         { 
		   
     this.shadowRoot.innerHTML = `
		  <style>
	.prods {
		table-layout: fixed;
		width: 100%;
		white-space: nowrap;
	}
	
	.prods td {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	/* Column widths for ticket */
		.row-Prod {
		width: 40%;
	}

	.row-PU{
		width: 20%;
	}
	
	.row-IVA {
		width: 10%;
	}

	.row-Preco{
		width: 20%;
	}
	
	.row-Qnt {
		width: 10%;
	}
	.prods td {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.prods th {
		background: darkblue;
		color: white;
	}
	
	.prods td,
	.prods th {
		text-align: left;
		padding: 5px 10px;
	}
	
	.prods tr:nth-child(even) {
		background: lightblue;
	}
	</style>
               
		  <span>
                    

            <table class="prods">
              <thead>
				<tr>
					<th class="row-1 row-Prod">Prod</th>
					<th class="row-2 row-PU">PU</th>
					<th class ="row-3 row-IVA">IVA</th>
					<th class ="row-4 row-Preco">Preco</th>
					<th class ="row-5 row-Qnt">Quant</th>
                
              </tr>
			 </thead>
             
			 ${this.items.results.map((item) => {
				return `
              <tr>
					<td>${item.Item}</td>
					<td>${item.uP}</td>
					<td>${item.Iva}</td>
					<td>${item.Preco}</td>
					<td>${item.Quant}</td>		
			
            </tr>
              `;
            }).join("")}
            </table>
          </span>
        `;
        }
    
	 }
    });

