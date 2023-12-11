const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    try {
        const page = req.query.page;

        const limit = 8;
        const offset = (page - 1) * limit;

        const noOfProducts = await Product.countDocuments();
        const totalPages = Math.ceil(noOfProducts/limit);
        const productsDetails = await Product.find({}, '_id name price imageURL')
            .skip(offset)
            .limit(limit);

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

        res.status(200).json({productsDetails, pageData});
    }
    catch(err) {
        console.log(err);
    }
}