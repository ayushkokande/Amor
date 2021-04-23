
const linkPreload = () => {
function func(id) {
    store.dispatch({type: id});
    return new Promise((resolve,reject) => {
      setTimeout(()=>{
        console.log("Changed the link");
        resolve({msg: "Changed link"});
        reject({msg: "Couldnt change link"});
      },1);
    })
  }

  function onClick(e) {
    func(e.target.id).then(setChange(true));
  }
  
  return(
    <p onClick={onClick} id="home" class="navbar-brand">amor</p>
  )
}