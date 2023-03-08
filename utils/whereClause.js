// base = Product.find()
// bigQ = ?search=Bat&page=2&category=sports&rating[gte]=4&price[gte]=1000&price[lte]=5000&limit=5
// or
// bigQ = {
//     search: 'Bat',
//     page: '2',
//     category: 'sports',
//     rating: { gte: '4' },
//     price: { gte: '1000', lte: '5000' },
//     limit: '5'
//   }



// class whereClause {
//     constructor(base, bigQ){
//         this.base = base
//         this.bigQ = bigQ
//     }


//     //returns search results
//     search(){
//         const searchWord = this.bigQ.search ? {
//             name : {
//                 $regex : this.bigQ.search,
//                 $options : 'i'
//             }
//         } : {}

//         this.base = this.base.find({...searchWord})
//         return this
//     }

//     // return number products per page
//     pager() {
//         const page = parseInt(this.bigQ.page) || 1;
//         const limit = parseInt(this.bigQ.limit) || 6;
//         const startIndex = (page - 1) * limit;
//         const endIndex = page * limit;
    
//         this.base = this.base.skip(startIndex).limit(limit);
//         return this;
//       }



//     // we want rating and price filters, we dont need search, limit & category & also page
//     filter(){
//         const copyQ = {...this.bigQ}

//         delete copyQ["search"]
//         delete copyQ["limit"]
//         delete copyQ["page"]

//         if(this.bigQ.price || this.bigQ.rating){
//                     // convert bigQ into string to manipulate it
//             let stringOfCopyQ = JSON.stringify(copyQ)
//             // get - $gte
//             stringOfCopyQ = stringOfCopyQ.replace(/\b(gte | lte | gt | lt)\b/g, m=>`$${m}`)

//             const jsonOfCopyQ = JSON.parse(stringOfCopyQ)

//             this.base = this.base.find(jsonOfCopyQ) // Product.find({$gt : 4})
//             return this
//         }else{
//             return this.base.find()
//         }
//     }
// }

class WhereClause {
    constructor(base, bigQ) {
      this.base = base;
      this.bigQ = bigQ;
    }
  
    search() {
      const searchWord = this.bigQ.search
        ? {
            name: {
              $regex: this.bigQ.search,
              $options: "i",
            },
          }
        : {};
  
      this.base = this.base.find({ ...searchWord });
      return this;
    }
  
    filter() {
        const copyQ = { ...this.bigQ };
      
        delete copyQ["search"];
        delete copyQ["limit"];
        delete copyQ["page"];
      
        if (this.bigQ.price || this.bigQ.rating) {
          // convert bigQ into string to manipulate it
          let stringOfCopyQ = JSON.stringify(copyQ);
          // get - $gte
          stringOfCopyQ = stringOfCopyQ.replace(
            /\b(gte | lte | gt | lt)\b/g,
            (m) => `$${m}`
          );
      
          const jsonOfCopyQ = JSON.parse(stringOfCopyQ);
      
          this.base = this.base.find(jsonOfCopyQ); // Product.find({$gt : 4})
        } else {
          this.base = this.base.find();
        }
      
        return this;
      }
  
    pager() {
      const page = parseInt(this.bigQ.page) || 1;
      const limit = parseInt(this.bigQ.limit) || 6;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      this.base = this.base.skip(startIndex).limit(limit);
  
      return this;
    }
  }
  

export default WhereClause