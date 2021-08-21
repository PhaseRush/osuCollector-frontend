import { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import CollectionList from '../common/CollectionList';
import * as api from '../../utils/api'

function UserUploads() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState(null);

    // run this code on initial page load
    useEffect(async () => {

        // get user id from path, eg. /users/123/uploads
        const match = window.location.pathname.match(/^\/users\/(\d+)\/uploads/g)
        if (!match) { 
            alert('User not found.')
            setLoading(false)
            return
        }
        const userId = Number(match[0].replace('/users/', '').replace('/uploads', '').trim())

        // get user from database
        const user = await api.getUser(userId)
        if (user)
            setUser(user)
        else
            alert(`user with id ${userId} not found`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // get collections when user changes
    useEffect(() => {
        if (!user)
            return;
        api.getUserUploads(user.id)
            .then(collections => {
                setLoading(false);
                setCollections(collections);
            }).catch(err => {
                setLoading(false);
                console.log('Unable to fetch collections: ', err);
            });
    }, [user])

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <Spinner animation="border" />
            </div>
        )
    }
    if (collections && Array.isArray(collections)) {
        return (
            <div>
                <h1>
                    {user.osuweb.username}&apos;s Uploads
                </h1>
                <h4>
                    {collections.length} collections
                </h4>
                <CollectionList collections={collections}></CollectionList>
            </div>
        )
    }
    return (
        <h1>
            This user has not uploaded any collections!
        </h1>
    )
}

export default UserUploads;