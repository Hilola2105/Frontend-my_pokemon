import React, {Component} from 'react'
import axios from 'axios'
import withRouter from './withRouter';


class Pokemon extends Component {
    state = {
        name: "",
        pokemonIndex: "",
        imageUrl: "",
        types: [],
        description: "",
        stats: {
            hp: "",
            attack: "",
            defense: "",
            speed: "",
            specialAttack: "",
            specialDefense: ""
        },

        height: "",
        weight: "",
        eggGroups: "",
        abilities: "",
        genderRatioMale: "",
        genderRatioFemale: "",
        evs: "",
        hatchSteps: ""
    };
    

    async componentDidMount(){
        const {pokemonIndex} = this.props.params;

        //Urls for pokemon information
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
        const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}`;

        //Get pokemon information
        const pokemonRes = await axios.get(pokemonUrl);

        const name = pokemonRes.data.name;
        const imageUrl = pokemonRes.data.sprites.other.dream_world.front_default;

        let {hp, attack, defense, speed, specialAttack, specialDefense} = "";

        pokemonRes.data.stats.map(stat => {
            switch(stat.stat.name){
                case "hp":
                    hp = stat["base_stat"];
                    break
                case "attack":
                    attack = stat["base_stat"];
                    break
                case "defense":
                    defense = stat["base_stat"];
                    break
                case "speed":
                    speed = stat["base_stat"];
                    break
                case "special-attack":
                    specialAttack = stat["base_stat"];
                    break
                case "special-defense":
                    specialDefense = stat["base_stat"];
                    break
            }
        });

        const height = Math.round((pokemonRes.data.height * 0.328084 + 0.0001) * 100) / 100;
        const weight = Math.round((pokemonRes.data.weight * 0.220462 + 0.0001) * 100) / 100;
        const types = pokemonRes.data.types.map(type => type.type.name);
        const abilities = pokemonRes.data.abilities.map(ability => {
            return ability.ability.name.toLowerCase().split("-").map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(" ");
        });

        const evs = pokemonRes.data.stats.filter(stat => {
            if(stat.effort > 0) return true;
            return false;
        }).map(stat =>{
            return `${stat.effort} ${stat.stat.name.toLowerCase().split("-").map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(" ")}`;
        }).join(", ");

        await axios.get(pokemonSpeciesUrl).then(res => {
            let description = "";
            res.data.flavor_text_entries.some(flavor => {
                if(flavor.language.name === "en"){
                    description = flavor.flavor_text;
                    return;
                }
            });

            const femaleRate = res.data["gender_rate"];
            const genderRatioFemale = 12.5 * femaleRate;
            const genderRatioMale = 12.5 * (8 - femaleRate);

            const catchRate = Math.round((100/255) * res.data["capture_rate"]);

            const eggGroups = res.data["egg_groups"].map(group => {
                return group.name.toLowerCase().split(" ").map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(" ")
            }).join(", ");

            const hatchSteps = 255 * (res.data["hatch_counter"] + 1);

            this.setState({
                description,
                genderRatioFemale,
                genderRatioMale,
                catchRate,
                eggGroups,
                hatchSteps
            });
        });

        this.setState({
            imageUrl,
            pokemonIndex,
            name,
            types,
            stats: {
                hp,
                attack,
                defense,
                speed,
                specialAttack,
                specialDefense
            },
            height,
            weight,
            abilities,
            evs
        })
    }


    render() {
        return (
        <div className="col mt-2 mb-3">
           <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-7">
                            <div className="float-start text-dark">
                                {this.state.types.map(type => (
                                    <span key={type} className="badge fs-6 rounded-pill px-5 py-3 ms-2 text-dark">
                                        {type.toLowerCase().split(" ").map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(" ")}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="col-5">
                            <h5 className="float-end fs-6 badge rounded-pill px-5 py-3 ms-2"></h5>
                        </div>
                    </div>
                </div>
                <div className="card-body align-items-center" >
                    <div className="row align-items-center">
                        <div className="d-flex">
                            <div className="col-6 d-flex align-items-center justify-content-center">
                                <img src={this.state.imageUrl} style={{width: "50%"}} className="card-img-top rounded mt-2" alt={this.state.name} />
                            </div>
                        </div>
                        <div className="col-md-12 ps-5">
                            <h4 className="mx-auto">{this.state.name.toLowerCase().split(" ").map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(" ")}</h4>
                            <div className="row align-items-center">
                                    <div className="col-12 col-md-3">HP</div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar" role="progressBar" style={{width: `${this.state.stats.hp}%`}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                                <small>{this.state.stats.hp}</small>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div className="row align-items-center">
                                    <div className="col-12 col-md-3">Attack</div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar" role="progressBar" style={{width: `${this.state.stats.attack}%`}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                                <small>{this.state.stats.attack}</small>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div className="row align-items-center">
                                    <div className="col-12 col-md-3">Speed</div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar" role="progressBar" style={{width: `${this.state.stats.speed}%`}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                                <small>{this.state.stats.speed}</small>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div className="row align-items-center">
                                    <div className="col-12 col-md-3">Defense</div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar" role="progressBar" style={{width: `${this.state.stats.defense}%`}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                                <small>{this.state.stats.defense}</small>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div className="row align-items-center">
                                    <div className="col-12 col-md-3">Special Attack</div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar" role="progressBar" style={{width: `${this.state.stats.specialAttack}%`}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                                <small>{this.state.stats.specialAttack}</small>
                                            </div>
                                        </div>
                                    </div>
                            </div>

                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        )
    }
}

export default withRouter(Pokemon);
