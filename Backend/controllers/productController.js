const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    try {
        const page = req.query.page;
        const search = req.query.search;

        const limit = 8;
        const offset = (page - 1) * limit;

        const regex = new RegExp(search, 'i');
        let noOfProducts;
        let productsDetails;

        if (search) {
            noOfProducts = await Product.countDocuments({
                $or: [
                    { name: regex },
                    { brand: regex },
                    { gender: regex },
                    { category: regex },
                ]
            });
            productsDetails = await Product.find({
                $or: [
                    { name: regex },
                    { brand: regex },
                    { gender: regex },
                    { category: regex },
                ]
            },
                '_id name price imageURL')
                .skip(offset)
                .limit(limit);
        }
        else {
            noOfProducts = await Product.countDocuments();
            productsDetails = await Product.find({}, '_id name price imageURL')
                .skip(offset)
                .limit(limit);
        }

        const totalPages = Math.ceil(noOfProducts / limit);

        const currentPage = Number(page);
        const hasNextPage = totalPages > currentPage;
        const nextPage = currentPage + 1;
        const hasNextToNextPage = totalPages > currentPage + 1;
        const nextToNextPage = currentPage + 2;
        const hasPreviousPage = currentPage > 1;
        const previousPage = currentPage - 1;
        const hasPreviousToPreviousPage = currentPage - 1 > 1;
        const previousToPreviousPage = currentPage - 2;

        const pageData = {
            currentPage,
            hasNextPage,
            nextPage,
            hasNextToNextPage,
            nextToNextPage,
            hasPreviousPage,
            previousPage,
            hasPreviousToPreviousPage,
            previousToPreviousPage
        }

        res.status(200).json({ productsDetails, pageData });
    }
    catch (err) {
        console.log(err);
    }
}

exports.getProduct = async (req, res) => {
    try {
        const productId = req.query.id;

        const productDetails = await Product.findOne({ _id: productId });

        res.status(200).json({ productDetails });
    }
    catch (err) {
        console.log(err);
    }
}