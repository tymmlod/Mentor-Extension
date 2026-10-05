document.addEventListener('DOMContentLoaded', function () {
  const ids = [
    'nbEh', 'nbEh_Button', 'reset_Button',
    'save_Button', 'save_Form', 'nom_Input', 'prenom_Input',
    'confirm_Button', 'cancel_Button', 'error_Message', 'saves_List'
  ];

  const el = {};
  const missing = [];
  ids.forEach(function (id) {
    el[id] = document.getElementById(id);
    if (!el[id]) missing.push(id);
  });

  if (missing.length > 0) {
    console.error('Éléments introuvables dans counter.html :', missing.join(', '));
    return;
  }

  if (typeof chrome === 'undefined' || !chrome.storage) {
    console.error('chrome.storage indisponible : ajoute "storage" dans "permissions" du manifest.json');
    return;
  }

  let count = 0;
  let saves = [];

  chrome.storage.sync.get(['nbEh', 'saves'], function (result) {
    count = result.nbEh || 0;
    saves = result.saves || [];
    el.nbEh.textContent = count;
    renderSaves();
  });

  // --- Compteur ---
  el.nbEh_Button.addEventListener('click', function () {
    count++;
    el.nbEh.textContent = count;
    chrome.storage.sync.set({ nbEh: count });
  });

  el.reset_Button.addEventListener('click', function () {
    count = 0;
    el.nbEh.textContent = count;
    chrome.storage.sync.set({ nbEh: count });
  });

  // --- Sauvegardes ---
  function persistSaves() {
    chrome.storage.sync.set({ saves: saves });
  }

  function renderSaves() {
    el.saves_List.textContent = '';

    saves.forEach(function (save) {
      const li = document.createElement('li');

      const label = document.createElement('span');
      label.textContent = save.prenom + ' ' + save.nom + ' : ' + save.valeur;

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'delete_button';
      deleteButton.textContent = 'Supprimer';
      deleteButton.addEventListener('click', function () {
        saves = saves.filter(function (s) {
          return s.id !== save.id;
        });
        persistSaves();
        renderSaves();
      });

      li.appendChild(label);
      li.appendChild(deleteButton);
      el.saves_List.appendChild(li);
    });
  }

  function openForm() {
    el.save_Form.hidden = false;
    el.prenom_Input.focus();
  }

  function closeForm() {
    el.save_Form.hidden = true;
    el.nom_Input.value = '';
    el.prenom_Input.value = '';
    el.error_Message.textContent = '';
  }

  el.save_Button.addEventListener('click', openForm);
  el.cancel_Button.addEventListener('click', closeForm);

  el.confirm_Button.addEventListener('click', function () {
    const nom = el.nom_Input.value.trim();
    const prenom = el.prenom_Input.value.trim();

    if (!nom || !prenom) {
      el.error_Message.textContent = 'Le nom et le prénom sont obligatoires.';
      return;
    }

    // Même personne déjà enregistrée : on remplace sa sauvegarde
    const existing = saves.find(function (s) {
      return s.nom.toLowerCase() === nom.toLowerCase() &&
             s.prenom.toLowerCase() === prenom.toLowerCase();
    });

    if (existing) {
      existing.valeur = count;
    } else {
      saves.push({ id: Date.now(), nom: nom, prenom: prenom, valeur: count });
    }

    persistSaves();
    renderSaves();
    closeForm();
  });
});