const User = require('../models/User');
const Sheet = require('../models/Sheet');

// Assign a sheet to a client
exports.assignSheets = async (req, res) => {
  try {
    const { clientId, addedSheetIds, removedSheetIds } = req.body;

    if (!clientId || !Array.isArray(addedSheetIds) || !Array.isArray(removedSheetIds)) {
      return res.status(400).json({ message: 'Invalid input: Clients and sheets are required' });
    }

    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Overwrite with the new sheets provided in the request
    client.assignedSheets = [...addedSheetIds];

    await client.save();
    res.status(200).json({ message: 'Sheets assigned successfully' });
  } catch (error) {
    console.error('Error assigning sheets:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Get all sheets assigned to a client
exports.getClientSheets = async (req, res) => {
  try {
    const client = await User.findById(req.params.clientId).populate('assignedSheets');
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json(client.assignedSheets);
  } catch (error) {
    console.error('Error fetching client sheets:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all clients
exports.getAllClients = async (req, res) => {
    try {
      const clients = await User.find({ role: 'client' }).select('-password'); // Exclude password field
  
      if (!clients.length) {
        return res.status(404).json({ message: 'No clients found' });
      }
  
      res.status(200).json(clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


