import React from "react";
import "./App.css";
import jsTPS from "./jsTPS.js";
import ChangeItem_Transaction from "./transactions/ChangeItem_Transaction.js";
import MoveItem_Transaction from "./transactions/MoveItem_Transaction.js";

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from "./db/DBManager";

// THESE ARE OUR REACT COMPONENTS
import DeleteModal from "./components/DeleteModal";
import Banner from "./components/Banner.js";
import Sidebar from "./components/Sidebar.js";
import Workspace from "./components/Workspace.js";
import Statusbar from "./components/Statusbar.js";

class App extends React.Component {
  constructor(props) {
    super(props);

    // THIS WILL TALK TO LOCAL STORAGE
    this.db = new DBManager();

    // THIS WILL MANAGE OUR TRANSACTIONS
    this.tps = new jsTPS();

    // GET THE SESSION DATA FROM OUR DATA MANAGER
    let loadedSessionData = this.db.queryGetSessionData();

    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);

    // SETUP THE INITIAL STATE
    this.state = {
      currentList: null,
      currentItemOver: null,
      currentDeleteList: null,
      hasUndo: null,
      hasRedo: null,
      hasClose: null,
      sessionData: loadedSessionData,
    };
  }

  componentDidMount() {
    window.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.keyCode === 90) {
        this.undo();
      } else if (event.ctrlKey && event.keyCode === 89) {
        this.redo();
      }
    });
  }

  sortKeyNamePairsByName = (keyNamePairs) => {
    keyNamePairs.sort((keyPair1, keyPair2) => {
      // GET THE LISTS
      return keyPair1.name.localeCompare(keyPair2.name);
    });
  };
  // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
  createNewList = () => {
    // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
    let newKey = this.state.sessionData.nextKey;
    let newName = "Untitled" + newKey;

    // MAKE THE NEW LIST
    let newList = {
      key: newKey,
      name: newName,
      items: ["?", "?", "?", "?", "?"],
    };

    // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
    // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
    let newKeyNamePair = { key: newKey, name: newName };
    let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
    this.sortKeyNamePairsByName(updatedPairs);

    // CHANGE THE APP STATE SO THAT IT THE CURRENT LIST IS
    // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
    // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
    // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
    // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
    // SHOULD BE DONE VIA ITS CALLBACK
    this.setState(
      (prevState) => ({
        currentList: newList,
        currentItemOver: prevState.currentItemOver,
        currentDeleteList: prevState.currentDeleteList,
        hasUndo: prevState.hasUndo,
        hasRedo: prevState.hasRedo,
        hasClose: prevState.hasClose,
        sessionData: {
          nextKey: prevState.sessionData.nextKey + 1,
          counter: prevState.sessionData.counter + 1,
          keyNamePairs: updatedPairs,
        },
      }),
      () => {
        // PUTTING THIS NEW LIST IN PERMANENT STORAGE
        // IS AN AFTER EFFECT
        this.db.mutationCreateList(newList);
        this.db.mutationUpdateSessionData(this.state.sessionData);
        this.setToolbarStatus();
      }
    );
  };

  removeList = (keyNamePair) => {
    let key = keyNamePair.key;
    let newKeyNamePairs = this.state.sessionData.keyNamePairs;
    let list = this.db.queryGetList(key);

    let index;
    for (let i = 0; i < newKeyNamePairs.length; i++) {
      if (newKeyNamePairs[i].key === key) {
        index = i;
      }
    }
    newKeyNamePairs.splice(index, 1);
    this.sortKeyNamePairsByName(newKeyNamePairs);

    if (this.state.currentList !== null && this.state.currentList.key === list.key) {
      this.setState(
        (prevState) => ({
          currentList: null,
          currentItemOver: prevState.currentItemOver,
          currentDeleteList: prevState.currentDeleteList,
          hasUndo: prevState.hasUndo,
          hasRedo: prevState.hasRedo,
          hasClose: prevState.hasClose,
          sessionData: {
            nextKey: prevState.sessionData.nextKey,
            counter: prevState.sessionData.counter,
            keyNamePairs: newKeyNamePairs,
          },
        }),
        () => {
          // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
          // THE TRANSACTION STACK IS CLEARED
          this.tps.clearAllTransactions();
          this.setToolbarStatus();
          this.db.mutationUpdateSessionData(this.state.sessionData);
          this.hideDeleteListModal();
        }
      );
    } else {
      this.setState(
        (prevState) => ({
          currentList: prevState.currentList,
          currentItemOver: prevState.currentItemOver,
          currentDeleteList: prevState.currentDeleteList,
          hasUndo: prevState.hasUndo,
          hasRedo: prevState.hasRedo,
          hasClose: prevState.hasClose,
          sessionData: {
            nextKey: prevState.sessionData.nextKey,
            counter: prevState.sessionData.counter,
            keyNamePairs: newKeyNamePairs,
          },
        }),
        () => {
          // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
          // THE TRANSACTION STACK IS CLEARED
          this.db.mutationUpdateSessionData(this.state.sessionData);
          this.hideDeleteListModal();
        }
      );
    }
  };

  // SIMPLE UNDO/REDO FUNCTIONS
  undo() {
    if (this.tps.hasTransactionToUndo()) {
      this.tps.undoTransaction();
    }
    this.setToolbarStatus();
  }

  redo() {
    if (this.tps.hasTransactionToRedo()) {
      this.tps.doTransaction();
    }
    this.setToolbarStatus();
  }

  renameItemTransaction = (index, textValue) => {
    let oldText = this.state.currentList.items[index];
    let newText = textValue;

    let transaction = new ChangeItem_Transaction(this, index, oldText, newText);
    this.tps.addTransaction(transaction);
  };
  renameItem = (index, textValue) => {
    let newCurrentList = this.state.currentList;

    for (let i = 0; i < newCurrentList.items.length; i++) {
      if (i === index) {
        newCurrentList.items[i] = textValue;
      }
    }
    this.setState(
      (prevState) => ({
        currentList: newCurrentList,
        currentItemOver: prevState.currentItemOver,
        currentDeleteList: prevState.currentDeleteList,
        hasUndo: prevState.hasUndo,
        hasRedo: prevState.hasRedo,
        hasClose: prevState.hasClose,
        sessionData: {
          nextKey: prevState.sessionData.nextKey,
          counter: prevState.sessionData.counter,
          keyNamePairs: prevState.sessionData.keyNamePairs,
        },
      }),
      () => {
        // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
        // THE TRANSACTION STACK IS CLEARED
        this.db.mutationUpdateList(newCurrentList);
        this.db.mutationUpdateSessionData(this.state.sessionData);
        this.setToolbarStatus();
      }
    );
  };

  itemDragEnd = () => {
    this.setState(
      (prevState) => ({
        currentList: prevState.currentList,
        currentItemOver: null,
        currentDeleteList: prevState.currentDeleteList,
        hasUndo: prevState.hasUndo,
        hasRedo: prevState.hasRedo,
        hasClose: prevState.hasClose,
        sessionData: {
          nextKey: prevState.sessionData.nextKey,
          counter: prevState.sessionData.counter,
          keyNamePairs: prevState.sessionData.keyNamePairs,
        },
      }),
      () => {
        // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
        // THE TRANSACTION STACK IS CLEARED
      }
    );
  };
  itemDragOver = (index) => {
    let newCurrentItemOver = index;

    this.setState(
      (prevState) => ({
        currentList: prevState.currentList,
        currentItemOver: newCurrentItemOver,
        currentDeleteList: prevState.currentDeleteList,
        hasUndo: prevState.hasUndo,
        hasRedo: prevState.hasRedo,
        hasClose: prevState.hasClose,
        sessionData: {
          nextKey: prevState.sessionData.nextKey,
          counter: prevState.sessionData.counter,
          keyNamePairs: prevState.sessionData.keyNamePairs,
        },
      }),
      () => {
        // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
        // THE TRANSACTION STACK IS CLEARED
      }
    );
  };

  swapItemTransaction = (newIndex, oldIndex) => {
    let transaction = new MoveItem_Transaction(this, oldIndex, newIndex);
    this.tps.addTransaction(transaction);
  };

  swapItem = (newIndex, oldIndex) => {
    let newCurrentList = this.state.currentList;
    newCurrentList.items.splice(
      newIndex,
      0,
      newCurrentList.items.splice(oldIndex, 1)[0]
    );

    this.setState(
      (prevState) => ({
        currentList: newCurrentList,
        currentItemOver: null,
        currentDeleteList: prevState.currentDeleteList,
        hasUndo: prevState.hasUndo,
        hasRedo: prevState.hasRedo,
        hasClose: prevState.hasClose,
        sessionData: {
          nextKey: prevState.sessionData.nextKey,
          counter: prevState.sessionData.counter,
          keyNamePairs: prevState.sessionData.keyNamePairs,
        },
      }),
      () => {
        // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
        // THE TRANSACTION STACK IS CLEARED
        this.db.mutationUpdateList(newCurrentList);
        this.db.mutationUpdateSessionData(this.state.sessionData);
        this.setToolbarStatus();
      }
    );
  };
  renameList = (key, newName) => {
    let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
    // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
    for (let i = 0; i < newKeyNamePairs.length; i++) {
      let pair = newKeyNamePairs[i];
      if (pair.key === key) {
        pair.name = newName;
      }
    }
    this.sortKeyNamePairsByName(newKeyNamePairs);

    // WE MAY HAVE TO RENAME THE currentList
    let currentList = this.state.currentList;
    if (currentList.key === key) {
      currentList.name = newName;
    }

    this.setState(
      (prevState) => ({
        currentList: prevState.currentList,
        currentItemOver: prevState.currentItemOver,
        currentDeleteList: prevState.currentDeleteList,
        hasUndo: prevState.hasUndo,
        hasRedo: prevState.hasRedo,
        hasClose: prevState.hasClose,
        sessionData: {
          nextKey: prevState.sessionData.nextKey,
          counter: prevState.sessionData.counter,
          keyNamePairs: newKeyNamePairs,
        },
      }),
      () => {
        // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
        // THE TRANSACTION STACK IS CLEARED
        let list = this.db.queryGetList(key);
        list.name = newName;
        this.db.mutationUpdateList(list);
        this.db.mutationUpdateSessionData(this.state.sessionData);
      }
    );
  };
  // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
  loadList = (key) => {
    let newCurrentList = this.db.queryGetList(key);
    this.setState(
      (prevState) => ({
        currentList: newCurrentList,
        currentItemOver: prevState.currentItemOver,
        currentDeleteList: prevState.currentDeleteList,
        hasUndo: prevState.hasUndo,
        hasRedo: prevState.hasRedo,
        hasClose: true,
        sessionData: prevState.sessionData,
      }),
      () => {
        // ANY AFTER EFFECTS?
        this.tps.clearAllTransactions();
        this.setToolbarStatus();
      }
    );
  };
  // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
  closeCurrentList = () => {
    this.setState(
      (prevState) => ({
        currentList: null,
        currentItemOver: prevState.currentItemOver,
        currentDeleteList: prevState.currentDeleteList,
        hasUndo: false,
        hasRedo: false,
        hasClose: false,
        listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
        sessionData: this.state.sessionData,
      }),
      () => {
        this.tps.clearAllTransactions();
        // ANY AFTER EFFECTS?
      }
    );
  };
  deleteList = (keyNamePair) => {
    // SOMEHOW YOU ARE GOING TO HAVE TO FIGURE OUT
    // WHICH LIST IT IS THAT THE USER WANTS TO
    // DELETE AND MAKE THAT CONNECTION SO THAT THE
    // NAME PROPERLY DISPLAYS INSIDE THE MODAL
    this.setState(
      (prevState) => ({
        currentList: prevState.currentList,
        currentItemOver: prevState.currentItemOver,
        currentDeleteList: keyNamePair,
        hasUndo: prevState.hasUndo,
        hasRedo: prevState.hasRedo,
        hasClose: prevState.hasClose,
        sessionData: prevState.sessionData,
      }),
      () => {
        this.showDeleteListModal();
        // ANY AFTER EFFECTS?
      }
    );
  };
  // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
  // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
  showDeleteListModal() {
    let modal = document.getElementById("delete-modal");
    modal.classList.add("is-visible");
  }
  // THIS FUNCTION IS FOR HIDING THE MODAL
  hideDeleteListModal() {
    let modal = document.getElementById("delete-modal");
    modal.classList.remove("is-visible");
  }

  setToolbarStatus() {
    let statuses = [];

    if (this.tps.hasTransactionToUndo()) {
      statuses.push(true);
    } else {
      statuses.push(false);
    }

    if (this.tps.hasTransactionToRedo()) {
      statuses.push(true);
    } else {
      statuses.push(false);
    }

    if (this.state.currentList !== null) {
      statuses.push(true);
    } else {
      statuses.push(false);
    }

    this.setState(
      (prevState) => ({
        currentList: prevState.currentList,
        currentItemOver: prevState.currentItemOver,
        currentDeleteList: prevState.currentDeleteList,
        hasUndo: statuses[0],
        hasRedo: statuses[1],
        hasClose: statuses[2],
        sessionData: prevState.sessionData,
      }),
      () => {}
    );
  }

  render() {
    return (
      <div id="app-root">
        <Banner
          title="Top 5 Lister"
          closeCallback={this.closeCurrentList}
          undoCallback={this.undo}
          redoCallback={this.redo}
          hasUndo={this.state.hasUndo}
          hasRedo={this.state.hasRedo}
          hasClose={this.state.hasClose}
        />
        <Sidebar
          heading="Your Lists"
          currentList={this.state.currentList}
          keyNamePairs={this.state.sessionData.keyNamePairs}
          createNewListCallback={this.createNewList}
          deleteListCallback={this.deleteList}
          loadListCallback={this.loadList}
          renameListCallback={this.renameList}
        />
        <Workspace
          currentList={this.state.currentList}
          currentItemOver={this.state.currentItemOver}
          renameItemCallback={this.renameItemTransaction}
          swapItemCallback={this.swapItemTransaction}
          itemDragOverCallback={this.itemDragOver}
          itemDragEndCallback={this.itemDragEnd}
        />
        <Statusbar currentList={this.state.currentList} />
        <DeleteModal
          hideDeleteListModalCallback={this.hideDeleteListModal}
          currentDeleteList={this.state.currentDeleteList}
          removeListCallback={this.removeList}
        />
      </div>
    );
  }
}

export default App;
