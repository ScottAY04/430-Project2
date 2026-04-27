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

const AlterDomo = (e, onDomoChange) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoNameChange').value;
    const newAge = e.target.querySelector('#ageChange').value;
    const newHeight = e.target.querySelector('#domoHeightChange').value;
    

    if(!name){
        helper.handleError('Please put in a name');
        return false;
    }

    if(!newAge && !newHeight){
        helper.handleError('Please put in an age or height to change!');
        return false;
    }

    console.log(name, newAge, newHeight);
    helper.sendPost(e.target.action, {name, newAge, newHeight}, onDomoChange);
    return false;
}

const FinishCheckBox = (props) => {
    const modelID = props.gunpla._id;

    const [isChecked, checkHandler] = useState(() => {
        const saved = localStorage.getItem(modelID);
        return saved !== null ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem(modelID, JSON.stringify(isChecked));
    }, [isChecked]);

    const changeState = (e) => {
        checkHandler(!isChecked);
        const name = props.gunpla.name;
        const grade = props.gunpla.grade;
        const built = !isChecked;

        helper.sendPost('/finished', {name, grade, built}, props.props.reloadGunplas);
    }

    return(
            <input 
            type='checkbox' 
            id='built' 
            action='/finished'
            checked={isChecked} 
            onChange={() => changeState()} 
            name='built' value='Built' />
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

const FilterGunpla = async (e) =>{
    e.preventDefault();

    console.log(e.target.querySelector('#grade').value);
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
            <div key={gunpla.id} className='gunpla'>
                <img src={src} alt="grade " className='gradePic' />
                <h3 className='gunplaName'>Name: {gunpla.name}</h3>
                <h3 className='gunplaGrade'>Grade: {gunpla.grade}</h3>
                <h3 className='gunplaPrice'>Price: {gunpla.price}</h3>
                <label for='built' className='gunplaBuilt'>Finished Building</label>
                <FinishCheckBox gunpla={gunpla} props={temp} id={document.querySelector('.gunpla')} />
            </div>
        );
    });

    return gunplaNodes;
}

const GunplaList = async () => {

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

        const id = gunpla.id

        return(
            <div key={gunpla.id} className='gunpla' id={id}>
                <img src={src} alt="grade " className='gradePic' />
                <h3 className='gunplaName'>Name: {gunpla.name}</h3>
                <h3 className='gunplaGrade'>Grade: {gunpla.grade}</h3>
                <h3 className='gunplaPrice'>Price: {gunpla.price}</h3>
                <div className='built'>
                    <label for='built' className='gunplaBuilt'>Finished Building</label>
                    <FinishCheckBox gunpla={gunpla} props={temp} id={document.querySelector('.gunpla')} />
                </div>

            </div>
        );
    });

    return gunplaNodes;
}

const ChangeDomo = (props) => {
    return(
        <form id="domoChange"
            onSubmit={(e)=> AlterDomo(e, props.triggerReload)}
            name="domoChange"
            action="/changeDomo"
            method="POST"
            className="domoChange"
        >
            <h3 className='nameChange'>Name: </h3>
            <input id='domoNameChange' type='text' name='name' placeholder='Domo You want to Change'/>
            <label htmlFor='ageChange'>Age: </label>
            <input id='ageChange' type='number' min="0" name='ageChange' />
            <label htmlFor='domoHeightChange'>Height: </label>
            <input id='domoHeightChange' type='number' min="0" name='domoHeightChange' />
            <input className='makeDomoSubmit' type='submit' value="Change Domo" />
        </form>
            
    );
}

const App = () => {
    const [reloadGunplas, setReloadGunplas] = useState(false);
    const [GunplaFinalList, SetForm] = useState([]);


    //reloads the page when you make the model
    useEffect(() => {
        SetForm(GunplaList());
    }, reloadGunplas);

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