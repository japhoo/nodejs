import { prisma } from "../config/db.js";


const addToWatchlist = async (req, res) => {

    const { movieId, status, rating, notes } = req.body;

    // check if movie exists
    const movie = await prisma.movie.findUnique({
        where: { id: movieId }
    });
    if (!movie) {
        return res.status(404).json({
            error: "Movie not found"
        });
    }


    // check if already added
    const existingInWatchlist = await prisma.watchlistItem.findUnique({
        where: {
            userId_movieId: {
                userId: req.user.id,
                movieId: movieId,
            }
        }
    });

    if (existingInWatchlist) {
        return res.status(400).json({
            error: "Movie already added to watchlist"
        });
    }

    // Create
    const watchlistItem = await prisma.watchlistItem.create({
        data: {
            userId: req.user.id,
            movieId,
            status: status || "PLANNED",
            rating,
            notes,
        }
    });

    res.status(201).json({
        status: "success",
        message: "Added successfully",
        data: {
            watchlistItem
        }
    });
}
const removeFromWatchlist = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            status: "error",
            message: "Movie ID required",
        })
    }
    const user_id = req.user.id;
    const isAdder = await prisma.watchlistItem.findUnique({
        where: {
            id
        }
    });
    if (!isAdder) {
        return res.status(400).json({
            status: "error",
            message: "Movie not found",
        })
    }


    // if(isAdder.userId!==req.user.id){
    //     return res.status(400).json({
    //         status: "error",
    //         message: "Movie not added by you!",
    //     })
    // }
    await prisma.watchlistItem.delete({
        where: {
            id
        }
    })
    res.status(200).json({
        status: "success",
        message: "Deleted successfully"
    });
}
const updateWatchlist = async (req, res) => {
    const { status, rating, notes } = req.body;
    const id = req.params.id;

    // check if movie exists
    const movie = await prisma.watchlistItem.findUnique({
        where: { id }
    });

    if (!movie) {
        return res.status(404).json({
            status: "error",
            message: "Movie not found"
        });
    }


    //check if the owner is the one updating
    if (movie.userId !== req.user.id) {
        return res.status(401).json({
            status: "error",
            message: "Not authorized to update!"
        });
    }
    const updateData = {};

    if (status !== undefined) updateData.status = status.toUpperCase();
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes;
    await prisma.watchlistItem.update({
        where: { id },
        data: updateData
    });

    res.status(200).json({
        status:"success",
        message:"Updated successfully",
    });
}




export { addToWatchlist, removeFromWatchlist,updateWatchlist };