import { useFetch } from "../useFetch";
import './ComStyles.css';
import { IoMdClose, IoMdArrowRoundBack} from "react-icons/io";
import { useEffect, useState } from "react";


interface GiphyImage {
    url: string;
}

interface GiphyData {
    images: {
        original: GiphyImage;
    };
}

interface GiphyResponse {
    data: GiphyData[];
}

type Props = {
    isDisplay: boolean;
}

const GifHandle = ({ isDisplay }: Props) => {
    const GiphyApiKey = 'dTTrs8c5LUucR6yfxNy7GhG0inrvbKCS';
    const [display, setDisplay] = useState<boolean>(true)
    const [searchQuery, setSearchQuery] = useState<string>('');
    const limit = 12;
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${GiphyApiKey}&q=${searchQuery}&limit=${limit}`;
    const SugList: string[] = [
        "Felicidad",
        "Sorpresa",
        "Amor",
        "Confusión",
        "Bailando",
        "Celebración",
        "Despedida",
        "Dormir",
        "Frustración",
        "Motivación",
        "Cara de asombro",
        "Emoción",
        "Tristeza",
        "Risa",
        "Enojo",
        "Aburrimiento",
        "Divertido",
        "Aplausos",
        "Festejo",
        "Agradecimiento",
        "Nervios",
        "Relajación",
        "Inspiración",
        "Alegría"
    ];
    const [sugerencias, setSugerencias] = useState<string[]>([]);
    function getRandomElements(array: string[], count: number) {
        if (count > array.length) {
            throw new Error("El número de elementos deseado es mayor que el tamaño del array.");
        }
        // Crear una copia del array para no modificar el original
        const shuffled = array.slice().sort(() => 0.5 - Math.random());
        // Tomar los primeros 'count' elementos del array barajado
        setSugerencias(shuffled.slice(0, count))
    }
    function setSearch (item:string) {
        setSearchQuery(item)
    }


    const { data: gifData, loading: gifLoading, error: gifError } = useFetch(url) as {
        data: GiphyResponse | null;
        loading: boolean;
        error: Error | null;
    };
    // Verificar si gifData está definido y contiene datos antes de acceder a ellos
    const gifSrc = gifData?.data?.[0]?.images?.original?.url || '';

    useEffect(()=>{
        setDisplay(isDisplay)
        getRandomElements(SugList, 6)
    },[isDisplay])

    return (
        <div className="gif-container" style={{display:display?'':'none'}}>
            <div className="gif-container-bg"></div>
            <div className="gif-display">
                <div className="gif-input-display">
                    {searchQuery.length>1?
                    (<IoMdArrowRoundBack onClick={()=>setSearchQuery('')} className="gif-input-btn" />):
                    (<IoMdClose onClick={()=>setDisplay(false)} className="gif-input-btn" />)}
                    <input
                        className="gif-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar GIFs"
                    />
                </div>
                <br />
                {searchQuery.length>1?
                    (<div>
                        {gifLoading && <h1>Loading gifs...</h1>}
                        {gifError && <h1>Error loading gif: {gifError.message}</h1>}
                        {gifSrc && <img src={gifSrc} alt="GIF" />}:
                    </div>):
                    (<div className="gif-suggest">
                        {sugerencias.map((item, index)=>(
                        <div key={index} className="gif-div" onClick={()=>setSearch(item)}>
                            <img className="gif-img"/>
                            <div className="gif-cover">
                                {item}
                            </div>
                        </div>
                        ))}
                    </div>)
                }
            </div>
        </div>
    );
}

export default GifHandle;