require('dotenv').config();
const express= require("express");
const mongoose= require("mongoose");

port1 = process.env.port1

const app= express();
app.use(express.json());

database_uri=process.env.DATABASE_URI

mongoose.connect(database_uri)
.then(()=>{
    console.log(`Database connected successfully.`)
})
.catch((error)=>{
    console.log(`Database connection Failed`,error.message)

})

const stateAndCapitalSchema= new mongoose.Schema({
    State:{
        type: String,
        require:[true,"State is required."]
    },

    Capital:{
        type:String,
        require:[true,"Capital is required."]
    },

    Governor:{
        type:String,
        require:[true,"Governor is required."]

    }
},{timestamps:true});

const stateAndCapitalModel= mongoose.model("StateAndCapital",stateAndCapitalSchema);

app.post('/stateAndCapital', async(req,res)=>{
    try {
        const data= req.body;
        const stateAndCapital= await stateAndCapitalModel.create(data);

        if (!stateAndCapital){
            res.status(400).json({
               message: `Error creating State and Capital with Governor`
            })
        }else{
            res.status(200).json({
                message:`State and Capital with Governor created successfully`,
                data: stateAndCapital
            })
        }
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
        
    }
});

// get all
app.get('/stateAndCapital', async(req,res)=>{
    try {
        const stateAndCapital= await stateAndCapitalModel.find();

        if(stateAndCapital === 0){
            res.status(404).json({
                message:`No states and capitals with governors found.`
            })
        }else{
            res.status(200).json({
                message:`List of states and capitals and their Governors`,
                data: stateAndCapital,
                totalNumberOfStateAndCapital: stateAndCapital.length
            })
        }
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
        
    }
})

// get one
app.get("/stateAndCapital/:id",async(req,res)=>{
    try {
        const stateAndCapitalId= req.params.id
        const stateAndCapital= await stateAndCapitalModel.findById(stateAndCapitalId)
        
        if(!stateAndCapital){
            res.status(404).json({
                message:`State and Capital with ID:${stateAndCapitalId} is not found`
            })
        }else{
            res.status(200).json({
                message:`State and Capital with ID:${stateAndCapitalId} is found.`,
                data: stateAndCapital 
            });
        }
    } catch (error) {
        res.status(500).json({
          message:error.message  
        });
        
    }

});

// to update
app.put('/stateAndCapital/:id', async(req,res)=>{
    try {
        const data=req.body
        const stateAndCapitalId=req.params.id
        const updatedStateAndCapital=await stateAndCapitalModel.findByIdAndUpdate(stateAndCapitalId,data,{new:true})
         
        if (!updatedStateAndCapital){
            res.status(404).json({
                message:`State and Capital with ID:${stateAndCapitalId} is not found`
            })
        }else{
            res.status(200).json({
                message:`State and Capital with ID:${stateAndCapitalId} has been updated successfully`,
                data:updatedStateAndCapital
            })
        }
     
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

});


// to delete
app.delete('/stateAndCapital/:id', async(req,res)=>{
    try {
        const stateAndCapitalId=req.params.id
        deletedStateAndCapital= await stateAndCapitalModel.findByIdAndDelete(stateAndCapitalId)

        if(!deletedStateAndCapital){
            res.status(404).json({
                message:`State and Capital with ID:${stateAndCapitalId} is not found.`
            })
        }else{
            res.status(200).json({
                message:`State and Capital with ID:${stateAndCapitalId} has been deleted successfully.`
            })

        }
        
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
         
    }
})
app.listen(port1,()=>{
    console.log(`Server is listening to PORT:${port1}`)
}); 

app.use('/')