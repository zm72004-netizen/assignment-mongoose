import { Note } from './note.model.js';


export const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const { id: userId } = req.query;
        const newNote = new Note({ title, content, userId });
        await newNote.save();
        res.status(201).json({ message: "Note created", newNote });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const updateNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { id: userId } = req.query;

        const note = await Note.findById(noteId);
        if (!note) return res.status(404).json({ message: "Note not found" });

        if (note.userId.toString() !== userId) {
            return res.status(403).json({ message: "You are not the owner" });
        }

        const updatedNote = await Note.findByIdAndUpdate(noteId, req.body, { new: true, runValidators: true });
        res.status(200).json({ message: "updated", note: updatedNote });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const replaceNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { id: userId } = req.query;

        const note = await Note.findById(noteId);
        if (!note) return res.status(404).json({ message: "Note not found" });

        if (note.userId.toString() !== userId) {
            return res.status(403).json({ message: "You are not the owner" });
        }

        const replacedNote = await Note.findOneAndReplace({ _id: noteId }, { ...req.body, userId }, { new: true, runValidators: true });
        res.status(200).json({ message: "replaced", replacedNote });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const updateAllNotesTitle = async (req, res) => {
    try {
        const { id: userId } = req.query;
        const { title } = req.body;

        const result = await Note.updateMany({ userId }, { title });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "No note found" });
        }
        res.status(200).json({ message: "All notes updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { id: userId } = req.query;

        const note = await Note.findById(noteId);
        if (!note) return res.status(404).json({ message: "Note not found" });

        if (note.userId.toString() !== userId) {
            return res.status(403).json({ message: "You are not the owner" });
        }

        await Note.findByIdAndDelete(noteId);
        res.status(200).json({ message: "delete", note });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getPaginatedNotes = async (req, res) => {
    try {
        const { id: userId } = req.query;
        let { page = 1, limit = 3 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const notes = await Note.find({ userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getNoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.query;

        const note = await Note.findById(id);
        if (!note) return res.status(404).json({ message: "Note not found" });

        if (note.userId.toString() !== userId) {
            return res.status(403).json({ message: "You are not the owner" });
        }

        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getNoteByContent = async (req, res) => {
    try {
        const { id: userId } = req.query;
        const { content } = req.query;

        const note = await Note.findOne({ userId, content: { $regex: content, $options: 'i' } });
        if (!note) return res.status(404).json({ message: "No note found" });

        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getNotesWithUser = async (req, res) => {
    try {
        const { id: userId } = req.query;
        const notes = await Note.find({ userId })
            .select('title userId createdAt')
            .populate('userId', 'email');

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getNotesAggregate = async (req, res) => {
    try {
        const { id: userId, title } = req.query;
        let matchStage = { userId: new mongoose.Types.ObjectId(userId) };

        if (title) {
            matchStage.title = { $regex: title, $options: 'i' };
        }

        const notes = await Note.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    title: 1,
                    userId: 1,
                    createdAt: 1,
                    'user.name': 1,
                    'user.email': 1
                }
            }
        ]);

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const deleteAllNotes = async (req, res) => {
    try {
        const { id: userId } = req.query;
        await Note.deleteMany({ userId });
        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};