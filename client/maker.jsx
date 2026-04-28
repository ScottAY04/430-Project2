const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleGunpla = (e, onGunplaAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#gunplaName').value;
    const grade = e.target.querySelector('#gunplaGrade').value;
    const price = e.target.querySelector('#gunplaPrice').value;

    if(!name || !grade || !price){
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {name, grade, price}, onGunplaAdded);
    return false;
}

const FinishCheckBox = (props) => {
    const getValue = () => {
        const saved = localStorage.getItem(props.gunpla._id);
        return saved !== null ? JSON.parse(saved) : false;
    }
    const [isChecked, checkHandler] = useState(getValue());

    useEffect(() => {
       localStorage.setItem(props.gunpla._id, JSON.stringify(isChecked));
    }, [isChecked]);

    const changeState = (e) => {
        checkHandler(!isChecked);
        const name = props.gunpla.name;
        const grade = props.gunpla.grade;
        const built = !isChecked;

        helper.sendPost('/finished', {_id: props.gunpla._id, built: built}, props.props.reloadGunplas);
    }

    return(
        <div className='built' style={{backgroundColor: isChecked ? "#2f9126" : "#8a2929"}} onClick={changeState} id={props.gunpla._id}>
            <label for='built' className='gunplaBuilt'>Finished Building</label>
            <input 
            type='checkbox'  
            checked={isChecked} />
        </div>
            
    );
}

const DeleteGunpla = async (e, _id, triggerReload) => {
    e.preventDefault();
    const response = await fetch(`/delete?_id=${_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    triggerReload();
    return false;
}

const DeleteModel = (props) => {
    return(
        <div className='delete'>
            <label for='delete' 
            id='delete'
            onClick={(e)=>DeleteGunpla(e, props.id, props.triggerReload)}
            action='/delete'
            >Delete Model</label>
        </div>
    );
}

const GunplaForm = (props) => {
    return(
        <form id="gunplaForm"
            onSubmit={(e)=> handleGunpla(e, props.triggerReload)}
            name="gunplaForm"
            action="/maker"
            method="POST"
            className="gunplaForm"
        >
            <label htmlFor="name">Name: </label>
            <input id='gunplaName' type='text' name='name' placeholder='Gunpla Model'/>
            <label htmlFor='grade'>Grade: </label>
            <select name="grade" id="gunplaGrade">
                <option value="HG">HG</option>
                <option value="RG">RG</option>
                <option value="MG">MG</option>
                <option value="PG">PG</option>
            </select>
            <label htmlFor='price'>Price: ¥</label>
            <input id='gunplaPrice' type='number' min="0" name='height' />
            <input className='makeGunplaSubmit' type='submit' checked='false' value="Add Gunpla" />
        </form>
    );
}

const FilteredForm = () => {
    return(
        <form id='filterForm'
        name='filterForm'
        action='/filtered'
        className='filterForm'>
            <label htmlFor='searchSelector'>Filter by: </label>
            <select name='grade' id='grade'>
                <option value="All">All</option>
                <option value="HG">HG</option>
                <option value="RG">RG</option>
                <option value="MG">MG</option>
                <option value="PG">PG</option>
            </select>
            <input className='makeGunplaSubmit' type='submit' value="Filter" />
        </form>
    );
}

const FilterGunpla = async (e, reload, setReloadGunplas) =>{
    e.preventDefault();
    helper.hideError();

    const filterOption = e.target.querySelector('#grade').value;

    const response = await fetch(`${e.target.action}?grade=${filterOption}`)
    const data = await response.json();
    const temp = data.gunplas;


        if(temp.length === 0){
        return(
            <div className="gunplaList">
                <h3 className='emptyGunpla'>No Models in this Grade!</h3>
            </div>
        );
    }

    //returns this if there is data
    const gunplaNodes = temp.map(gunpla => {

        //loads the images
        let src = "/assets/img";
        {
            if(gunpla.grade === 'HG'){
                src += "/highgrade.png"
            }
            if(gunpla.grade === 'RG'){
                src += "/realgrade.png"
            }
            if(gunpla.grade === 'MG'){
                src += "/mastergrade.png"
            }
            if(gunpla.grade === 'PG'){
                src += "/perfectgrade.png"
            }
        }



        return(
            <div key={gunpla.id} className='gunpla' id={gunpla.id}>
                <img src={src} alt="grade " className='gradePic' />
                <h3 className='gunplaName'>Name: {gunpla.name}</h3>
                <h3 className='gunplaGrade'>Grade: {gunpla.grade}</h3>
                <h3 className='gunplaPrice'>Price: {gunpla.price}</h3>
                <FinishCheckBox gunpla={gunpla} props={temp} />
                <DeleteModel id={gunpla._id} triggerReload={() => setReloadGunplas(!reload)} />
            </div>
        );
    });
    return gunplaNodes;
}

const GunplaList = async (reload, setReloadGunplas) => {
    const response = await fetch('/getGunplas');
    const data = await response.json();
    
    const temp = data.gunplas;

    //if there is nothing inside the data returns this
    if(temp.length === 0){
        return(
            <h3 className='emptyGunpla'>No Models Yet!</h3>
        );
    }

    //returns this if there is data
    const gunplaNodes = temp.map(gunpla => {
        //gets the correct image depending on the grade
        let src = "/assets/img";
        if(gunpla.grade === 'HG'){
            src += "/highgrade.png"
        }
         if(gunpla.grade === 'RG'){
            src += "/realgrade.png"
        }
         if(gunpla.grade === 'MG'){
            src += "/mastergrade.png"
        }
         if(gunpla.grade === 'PG'){
            src += "/perfectgrade.png"
        }


        return(
            <div key={gunpla.id} className='gunpla' id={gunpla.id}>
                <img src={src} alt="grade " className='gradePic' />
                <h3 className='gunplaName'>Name: {gunpla.name}</h3>
                <h3 className='gunplaGrade'>Grade: {gunpla.grade}</h3>
                <h3 className='gunplaPrice'>Price: {gunpla.price}</h3>
                <FinishCheckBox gunpla={gunpla} props={temp} />
                <DeleteModel id={gunpla._id} triggerReload={() => setReloadGunplas(!reload)} />
            </div>
        );
    });

    return gunplaNodes;
}

const App = () => {
    const [reloadGunplas, setReloadGunplas] = useState(false);
    const [GunplaFinalList, SetForm] = useState([]);

    //reloads the page when you make the model
    useEffect(() => {
        SetForm(GunplaList(reloadGunplas, setReloadGunplas));
    }, [reloadGunplas]);

    const changeGunplaList = (e) => {
        SetForm(FilterGunpla(e));
    }

    const finalRenderPage = 
        <div>
            <div id="makeGunpla">
                <GunplaForm triggerReload={() => setReloadGunplas(!reloadGunplas)} />
            </div>
            <div id="filterModels" onSubmit={(e) => changeGunplaList(e)}>
                <FilteredForm />
            </div>
            <div id="gunplas">
                <div id='gunplaList'>
                    {GunplaFinalList}
                </div>
            </div>
            <div id="right">Your ad goes here</div>
        </div>;

    return(finalRenderPage);
};

const init = () =>{
    const root = createRoot(document.getElementById('app'));
    root.render( <App />);
};

window.onload = init;