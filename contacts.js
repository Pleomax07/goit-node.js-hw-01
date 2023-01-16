const fs = require("fs").promises;
const path = require("path");
const colors = require("colors");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join("db/contacts.json");
const log = console.log;

const getContacts = async () => {
  try {
    const content = await fs.readFile(contactsPath);
    const contacts = JSON.parse(content);

    return contacts;
  } catch (error) {
    throw new Error(error);
  }
};

const listContacts = async () => {
  try {
    const allContacts = await getContacts();
    if (!allContacts.length) {
      log("Contact list is empty".inverse.green);
    } else {
      log(`Your contacts list (${allContacts.length})`.inverse);
      log(allContacts);
    }
    return allContacts;
  } catch (error) {
    throw new Error(error);
  }
};

const getContactById = async (contactId) => {
  try {
    const allContacts = await getContacts();
    const contactById = allContacts.find((contact) => contact.id === contactId);
    if (contactById) {
      log(`contact '${contactById.id}' found`.inverse.green);
      log(contactById);
    } else {
      log(`contact '${contactById.id}' not found`.inverse.red);
    }

    return contactById;
  } catch (error) {
    throw new Error(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const allContacts = await getContacts();
    const filterContacts = allContacts.filter(
      (contact) => contact.id !== contactId
    );
    if (filterContacts.length === allContacts.length) {
      log(`contact '${contactId}' not found`.inverse.red);
    } else {
      fs.writeFile(contactsPath, JSON.stringify(filterContacts));
      log(`contact '${contactId}' successfully deleted`.inverse.green);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const addContact = async (name, email, phone) => {
  try {
    const allContacts = await getContacts();
    const item = { id: uuidv4(), name, email, phone };
    const dublicateContact = allContacts.find(
      (contact) => contact.name === name
    );
    if (dublicateContact) {
      log(`Contact with name '${name}' already exists!`.inverse.red);
    } else {
      allContacts.push(item);
      fs.writeFile(contactsPath, JSON.stringify(allContacts));
      log(`Contact with name '${name}' saved!`.inverse.green);
      log(item);
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
