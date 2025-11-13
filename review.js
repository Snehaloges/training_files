const user={
    name:"Sneha",
    age:21
}
console.log("",user.name)

const arr =[1,2,3,4];
for(i=0;i<arr.length;i++){
    console.log(arr[i]);
}
function profile(){
    console.log("Welcome");
}
profile()

function Car(props){
    const {carInfo}=props
    const {brand} =carInfo
    const text = `Hi this is  a${brand} `;
    return(<>{text}</>)

}
function Gar(){
    const carInfo = {brand:"BMW"}
    return(<>
    {carInfo.brand !== undefined ?<Car carInfo={carInfo}/>: null}</>)
}
export default Gar;