import { LightningElement, track } from 'lwc';
import retriveNews from '@salesforce/apex/newsController.retriveNews';

export default class NewsLauncher extends LightningElement {
    @track result = [];
    @track selectedNews = {};
    @track isModalOpen = false;
    @track searchInput = '';
    @track category = '';
    @track country = '';
    @track totalResults = '';
    @track data = true;

    get modalClass(){
        return `slds-modal ${this.isModalOpen ? "slds-fade-in-open" :""}`
    }
    get modalBackdropClass(){
        return this.isModalOpen ? "slds-backdrop slds-backdrop_open" : "slds-backdrop"
    }

    countryValue = 'all';
    categoryValue = 'all';

    get countryOptions() {
        return [
            { label: 'All', value: 'all' },
            { label: 'United States', value: 'us' },
            { label: 'India', value: 'in' },
            { label: 'Canada', value: 'ca' },
            { label: 'Russia', value: 'rs' },
        ];
    }

    get categoryOptions() {
        return [
            { label: 'All', value: 'all' },
            { label: 'Business', value: 'business' },
            { label: 'Entertainment', value: 'entertainment' },
            { label: 'Science', value: 'science' },
            { label: 'Sports', value: 'sports' },
            { label: 'Technology', value: 'technology' },
            { label: 'General', value: 'general' },
            { label: 'Health', value: 'health' },
        ];
    }

    connectedCallback(){
        this.country = 'all';
        this.category = 'all';
        this.fetchNews();
        this.handleSubmit();
    }

    fetchNews(){
        retriveNews({searchKey:this.searchInput,country:this.country,category:this.category}).then(response=>{
            //console.log('response: '+JSON.stringify(response));
           // this.formatNewsData(response.articles)
            var res = response.articles;
            this.totalResults = response.totalResults;
            if(this.totalResults == 0){
                this.data = false;
            }
            this.result = res.map((item, index)=>{
                let id = `new_${index+1}`;
                let date = new Date(item.publishedAt).toDateString()
                let name = item.source.name;
                return { ...item, id: id, name: name, date: date}
            })

        }).catch(error=>{
            console.error(error);
        })
    }

    showModal(event){
        let id = event.target.dataset.item;
        this.result.forEach(item=>{
            if(item.id === id){
                this.selectedNews ={...item}
            }
        })
        this.isModalOpen = true;
    }
    closeModal(){
        this.isModalOpen = false;
    }

    // If you wanted to do something when user is entering the string
    handleSearch(event){
        this.searchInput = event.target.value;
        console.log('This is searchInput::'+ this.searchInput);
    }

    handleChange(event) {
        this.value = event.detail.value;
        this.type = event.detail.value;
    }

    handleCountryChange(event) {
        this.value = event.detail.value;
        this.country = event.detail.value;
    }

    handleCategoryChange(event) {
        this.value = event.detail.value;
        this.category = event.detail.value;
    }

    //To map the videoResults to iframe and related list 
    handleSubmit(){
        retriveNews({searchKey:this.searchInput,country:this.country,category:this.category})
        .then ((response)=>{
            //console.log(response);
            // this.formatNewsData(response.articles)
             var res = response.articles;
             this.totalResults = response.totalResults;
             if(this.totalResults == 0){
                this.data = false;
            }
             this.result = res.map((item, index)=>{
                 let id = `new_${index+1}`;
                 let date = new Date(item.publishedAt).toDateString()
                 let name = item.source.name;
                 return { ...item, id: id, name: name, date: date}
             })
        })
        .catch((error)=>{
            console.error(error);
        })

   }
}