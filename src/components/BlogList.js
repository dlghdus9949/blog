import axios from "axios";
import { useState, useEffect, useCallback, useRef } from "react";
import Card from "../components/Card";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "./Pagination";
import propTypes from 'prop-types';
import Toast from "./Toast";
import { v4 as uuidv4 } from 'uuid';

const BlogList = ({isAdmin}) => {

    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const pageParam = params.get('page');
    const [posts,setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentpage] = useState(1);
    const [numberOfPosts, setNumberOfPosts] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [, setToastRerender] = useState(false);
    const toasts = useRef([]);
    const limit = 5;

    useEffect(()=>{
        setNumberOfPages(Math.ceil(numberOfPosts/limit));
    },[numberOfPosts])

    const onClickPageButton = (page) => {
        navigate(`${location.pathname}?page=${page}`)
        setCurrentpage(page);
        getPosts(page);
    }

    const getPosts = useCallback((page = 1) => {
        let params = {
            _page: page,
            _limit: 5,
            _sort: 'id',
            _order: 'desc',
            title_like: searchText
        }

        if (!isAdmin) {
            params = { ...params, publish: true};
        }

        axios.get(`http://localhost:3001/posts`, {
            params
        }).then((res)=>{
            setNumberOfPosts(res.headers['x-total-count']);
            setPosts(res.data);
            setLoading(false);
        })
    },[isAdmin, searchText]);

    useEffect(()=>{
        const getPosts = (page = 1) => {
            let params = {
                _page: page,
                _limit: 5,
                _sort: 'id',
                _order: 'desc',
            }
    
            if (!isAdmin) {
                params = { ...params, publish: true};
            }
    
            axios.get(`http://localhost:3001/posts`, {
                params
            }).then((res)=>{
                setNumberOfPosts(res.headers['x-total-count']);
                setPosts(res.data);
                setLoading(false);
            })
        }

        setCurrentpage(parseInt(pageParam) || 1);
        getPosts(parseInt(pageParam) || 1);
    },[]);

    const deleteToast = (id) => {
        const fillteredToasts = toasts.current.filter(toast => {
            return toast.id !== id;
        });

        toasts.current = fillteredToasts;
        setToastRerender(prev => !prev);
    }

    const addToast = (toast) => {
        const id = uuidv4();
        const toastWithId = {
            ...toast,
            id
        }
        toasts.current = [
            ...toast.current,
            toastWithId
        ];
        setToastRerender(prev => !prev);
        setTimeout(()=>{
            deleteToast(id);
        }, 3000);
    }

    const deleteBlog = (e, id) => {
        e.stopPropagation();
        axios.delete(`http://localhost:3001/posts/${id}`).then(()=>{
            setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
            addToast({
                text: 'Successfully deleted',
                type: 'success'
            });
        });
    };


    if(loading){
        return(
            <LoadingSpinner/>
        );
    }

    const renderBlogList =() => {
        return posts.map(post => {
            return(
                <Card
                    key={post.id}
                    title={post.title}
                    onClick={()=> {navigate (`/blogs/${post.id}`)}}
                >
                    {isAdmin ? (<div>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick = {(e) => deleteBlog(e, post.id)}    
                        >
                            Delete
                        </button>
                    </div>) : null}
                </Card>
            )
        })
    }

    const onSearch = (e) => {
        if(e.key === 'Enter'){
            navigate(`${location.pathname}?page=1`)
            setCurrentpage(1);
            getPosts(1);
        }
    }

    return (
        <div>
            <Toast
                toasts={toasts.current}
                deleteToast={deleteToast}
            />
            <input 
                type="text"
                placeholder="Search..."
                className="form-control"
                value={searchText}
                onChange={(e)=>setSearchText(e.target.value)}
                onKeyUp={onSearch}
            />
            <hr />
            {posts.length===0 
                ? <div>No blog posts found</div>
                : <>
                    {renderBlogList()}
                    {numberOfPages > 1 && <Pagination
                        currentPage={currentPage}
                        numberOfpages={numberOfPages}
                        onClick={onClickPageButton}
                    />}
                </>}
            
        </div>
    )
};

BlogList.propTypes = {
    isAdmin: propTypes.bool
}

BlogList.defaultProps = {
    isAdmin: false
}

export default BlogList;