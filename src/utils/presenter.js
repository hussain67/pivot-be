const presenters = [];

const savePresenter = (id, room) => {
  presenters.push({ id, room });
  // console.log(presenters);
};

const getIdOfPresenter = room => {
  const presenter = presenters.find(item => {
    return item.room === room;
  });
  return presenter.id;
};

module.exports = { savePresenter, getIdOfPresenter };
