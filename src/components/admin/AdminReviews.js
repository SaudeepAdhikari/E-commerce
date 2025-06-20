import React, { useEffect, useState } from 'react';
import StarRating from '../StarRating';

function AdminReviews() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const res = await fetch('http://localhost:5000/api/products');
                const data = await res.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                setError('Failed to load products');
            }
            setLoading(false);
        }
        fetchProducts();
    }, []);

    const handleDeleteReview = async (productId, reviewIdx) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        setDeleting(true);
        try {
            const res = await fetch(`http://localhost:5000/api/products/${productId}/reviews/${reviewIdx}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(products => products.map(p =>
                    p._id === productId
                        ? { ...p, reviews: p.reviews.filter((_, idx) => idx !== reviewIdx) }
                        : p
                ));
            }
        } catch (err) { }
        setDeleting(false);
    };

    return (
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', margin: '2rem 0', padding: '2rem' }}>
            <h2>All Product Reviews</h2>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div style={{ color: 'red' }}>{error}</div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: 8 }}>Product</th>
                            <th style={{ textAlign: 'left', padding: 8 }}>Reviewer</th>
                            <th style={{ textAlign: 'left', padding: 8 }}>Rating</th>
                            <th style={{ textAlign: 'left', padding: 8 }}>Comment</th>
                            <th style={{ textAlign: 'left', padding: 8 }}>Date</th>
                            <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.flatMap(product =>
                            (product.reviews || []).map((review, idx) => (
                                <tr key={product._id + '-' + idx} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: 8 }}>{product.name}</td>
                                    <td style={{ padding: 8 }}>{review.author}</td>
                                    <td style={{ padding: 8 }}><StarRating rating={review.rating} size="small" /></td>
                                    <td style={{ padding: 8 }}>{review.comment}</td>
                                    <td style={{ padding: 8 }}>{review.date ? (new Date(review.date)).toLocaleDateString() : ''}</td>
                                    <td style={{ padding: 8 }}>
                                        <button
                                            style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                                            onClick={() => handleDeleteReview(product._id, idx)}
                                            disabled={deleting}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminReviews; 