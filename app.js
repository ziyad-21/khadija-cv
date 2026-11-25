(() => {
  const STORAGE_KEY = "khadija_cv_data_v1";
  const DEFAULT_AVATAR = "assets/images/profile.jpg";

  const DEFAULT_DATA = {
    name: "خديجة إبراهيم",
    badge: "متاحة للتعاون والمشاريع الرقمية",
    title: "مصممة تجربة مستخدم ومطوّرة واجهات أمامية",
    bio: "مصممة تجربة مستخدم ومطوّرة واجهات ويب متخصصة في بناء منتجات رقمية عربية حديثة تجمع بين جمال التصميم وسلاسة الأداء. أساعد الشركات ورواد الأعمال على تحويل أفكارهم إلى واجهات تفاعلية متجاوبة تحقق أعلى معدلات الرضا والتحويل. أهتم بأدق تفاصيل التباين والخطوط العربية وتجربة الاستخدام على مختلف الشاشات.",
    avatar: DEFAULT_AVATAR,
    skills: [
      { id: "sk-1", name: "تصميم واجهات وتجربة المستخدم (UI/UX)", level: 95 },
      { id: "sk-2", name: "تطوير الواجهات الأمامية (HTML5 / CSS3 / JS)", level: 92 },
      { id: "sk-3", name: "التصميم المتجاوب وبناء أنظمة التصميم", level: 90 },
      { id: "sk-4", name: "تحسين تجربة اللغة العربية (RTL Typography)", level: 96 },
      { id: "sk-5", name: "تحسين الأداء وإمكانية الوصول (Accessibility)", level: 88 }
    ],
    contacts: [
      { id: "ct-1", type: "email", label: "البريد الإلكتروني", value: "khadija.ibrahim@example.com" },
      { id: "ct-2", type: "whatsapp", label: "واتساب", value: "+966501234567" },
      { id: "ct-3", type: "linkedin", label: "لينكدإن", value: "https://linkedin.com/in/khadija-ibrahim" },
      { id: "ct-4", type: "github", label: "GitHub", value: "https://github.com/ziyad-21" }
    ]
  };

  let state = loadState();
  let editMode = false;
  let toastTimer = null;

  // DOM References
  const toggleEditBtn = document.getElementById("toggle-edit-btn");
  const toggleEditLabel = document.getElementById("toggle-edit-label");
  const editToolbar = document.getElementById("edit-toolbar");
  const printBtn = document.getElementById("print-btn");

  const topbarName = document.getElementById("topbar-name");
  const profileView = document.getElementById("profile-view");
  const profileEditForm = document.getElementById("profile-edit-form");
  const profileAvatar = document.getElementById("profile-avatar");
  const avatarFallback = document.getElementById("avatar-fallback");
  const avatarControls = document.getElementById("avatar-controls");
  const avatarUpload = document.getElementById("avatar-upload");
  const avatarRemoveBtn = document.getElementById("avatar-remove-btn");

  const profileBadge = document.getElementById("profile-badge");
  const profileName = document.getElementById("profile-name");
  const profileTitle = document.getElementById("profile-title");
  const profileBio = document.getElementById("profile-bio");

  const inputName = document.getElementById("input-name");
  const inputBadge = document.getElementById("input-badge");
  const inputTitle = document.getElementById("input-title");
  const inputBio = document.getElementById("input-bio");

  const skillsList = document.getElementById("skills-list");
  const skillsCount = document.getElementById("skills-count");
  const addSkillForm = document.getElementById("add-skill-form");
  const newSkillName = document.getElementById("new-skill-name");
  const newSkillLevel = document.getElementById("new-skill-level");

  const contactsList = document.getElementById("contacts-list");
  const contactsCount = document.getElementById("contacts-count");
  const addContactForm = document.getElementById("add-contact-form");
  const newContactType = document.getElementById("new-contact-type");
  const newContactLabel = document.getElementById("new-contact-label");
  const newContactValue = document.getElementById("new-contact-value");

  const exportBtn = document.getElementById("export-btn");
  const importFile = document.getElementById("import-file");
  const resetBtn = document.getElementById("reset-btn");

  const editModal = document.getElementById("edit-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalForm = document.getElementById("modal-form");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const toastEl = document.getElementById("toast");

  document.getElementById("current-year").textContent = String(new Date().getFullYear());

  function cloneDefaults() {
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return cloneDefaults();
      const parsed = JSON.parse(raw);
      return normalizeState(parsed);
    } catch {
      return cloneDefaults();
    }
  }

  function normalizeState(raw) {
    const def = cloneDefaults();
    return {
      name: typeof raw.name === "string" && raw.name.trim() ? raw.name : def.name,
      badge: typeof raw.badge === "string" ? raw.badge : def.badge,
      title: typeof raw.title === "string" && raw.title.trim() ? raw.title : def.title,
      bio: typeof raw.bio === "string" ? raw.bio : def.bio,
      avatar: typeof raw.avatar === "string" ? raw.avatar : def.avatar,
      skills: Array.isArray(raw.skills)
        ? raw.skills.map((s, idx) => ({
            id: s.id || `sk-${Date.now()}-${idx}`,
            name: String(s.name || "").trim() || "مهارة",
            level: clampNumber(Number(s.level) || 80, 10, 100)
          }))
        : def.skills,
      contacts: Array.isArray(raw.contacts)
        ? raw.contacts.map((c, idx) => ({
            id: c.id || `ct-${Date.now()}-${idx}`,
            type: c.type || "website",
            label: String(c.label || "").trim() || "تواصل",
            value: String(c.value || "").trim()
          }))
        : def.contacts
    };
  }

  function saveState(message) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (message) showToast(message);
    } catch {
      showToast("تعذر الحفظ محلياً: المساحة ممتلئة، صدّر البيانات أو صغّر الصور.");
    }
  }

  function clampNumber(val, min, max) {
    return Math.min(max, Math.max(min, val));
  }

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, 2600);
  }

  function getInitials(name) {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]} ${parts[1][0]}`;
    if (parts.length === 1) return parts[0].slice(0, 2);
    return "خ إ";
  }

  function sanitizeDigits(val) {
    let digits = String(val || "").replace(/[^\d]/g, "");
    if (digits.startsWith("00")) digits = digits.slice(2);
    return digits;
  }

  function buildContactHref(contact) {
    const v = String(contact.value || "").trim();
    if (!v) return "#";
    if (contact.type === "email") return `mailto:${v}`;
    if (contact.type === "phone") return `tel:${v.replace(/\s+/g, "")}`;
    if (contact.type === "whatsapp") {
      const digits = sanitizeDigits(v);
      return digits ? `https://wa.me/${digits}` : "#";
    }
    return /^https?:\/\//i.test(v) ? v : `https://${v}`;
  }

  function getContactGlyph(type) {
    const map = {
      email: "@",
      whatsapp: "WA",
      phone: "☎",
      linkedin: "in",
      github: "</>",
      website: "↗"
    };
    return map[type] || "↗";
  }

  function compressImageFile(file, maxSize = 640, maxBytes = 150 * 1024) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("read_failed"));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("decode_failed"));
        img.onload = () => {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;
          if (width > maxSize || height > maxSize) {
            const ratio = Math.min(maxSize / width, maxSize / height);
            width = Math.max(1, Math.round(width * ratio));
            height = Math.max(1, Math.round(height * ratio));
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          let quality = 0.82;
          let dataUrl = canvas.toDataURL("image/jpeg", quality);
          while (dataUrl.length * 0.75 > maxBytes && quality > 0.35) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }
          resolve(dataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function renderProfile() {
    topbarName.textContent = state.name;
    document.title = `${state.name} | السيرة الذاتية`;
    profileName.textContent = state.name;
    profileBadge.textContent = state.badge;
    profileBadge.hidden = !state.badge.trim();
    profileTitle.textContent = state.title;
    profileBio.textContent = state.bio;

    inputName.value = state.name;
    inputBadge.value = state.badge;
    inputTitle.value = state.title;
    inputBio.value = state.bio;

    const initials = getInitials(state.name);
    avatarFallback.textContent = initials;

    if (state.avatar) {
      profileAvatar.src = state.avatar;
      profileAvatar.alt = `الصورة الشخصية لـ ${state.name}`;
      profileAvatar.hidden = false;
      avatarFallback.hidden = true;
    } else {
      profileAvatar.hidden = true;
      avatarFallback.hidden = false;
    }
  }

  function renderSkills() {
    skillsList.innerHTML = "";
    skillsCount.textContent = `${state.skills.length} مهارات`;

    if (!state.skills.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "لا توجد مهارات مضافة حالياً. فعّل وضع التحرير لإضافة مهارات.";
      skillsList.appendChild(empty);
      return;
    }

    state.skills.forEach((skill) => {
      const card = document.createElement("article");
      card.className = "skill-item";

      const top = document.createElement("div");
      top.className = "skill-top";

      const nameEl = document.createElement("span");
      nameEl.className = "skill-name";
      nameEl.textContent = skill.name;

      const pctEl = document.createElement("span");
      pctEl.className = "skill-pct";
      pctEl.textContent = `${skill.level}%`;

      top.append(nameEl, pctEl);

      const bar = document.createElement("div");
      bar.className = "skill-bar";
      const fill = document.createElement("div");
      fill.className = "skill-fill";
      fill.style.width = `${skill.level}%`;
      bar.appendChild(fill);

      card.append(top, bar);

      if (editMode) {
        const actions = document.createElement("div");
        actions.className = "item-actions no-print";

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "btn btn-outline btn-xs";
        editBtn.textContent = "تعديل";
        editBtn.addEventListener("click", () => openEditSkillModal(skill.id));

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "btn btn-danger-outline btn-xs";
        delBtn.textContent = "حذف";
        delBtn.addEventListener("click", () => {
          state.skills = state.skills.filter((s) => s.id !== skill.id);
          saveState("تم حذف المهارة");
          renderSkills();
        });

        actions.append(editBtn, delBtn);
        card.appendChild(actions);
      }

      skillsList.appendChild(card);
    });
  }

  function renderContacts() {
    contactsList.innerHTML = "";
    contactsCount.textContent = `${state.contacts.length} وسائل`;

    if (!state.contacts.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "لا توجد وسائل تواصل مضافة حالياً. فعّل وضع التحرير لإضافة روابط تواصل.";
      contactsList.appendChild(empty);
      return;
    }

    state.contacts.forEach((contact) => {
      const card = document.createElement("article");
      card.className = "contact-card";

      const link = document.createElement("a");
      link.className = "contact-link";
      link.href = buildContactHref(contact);
      if (contact.type !== "email" && contact.type !== "phone") {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }

      const icon = document.createElement("span");
      icon.className = "contact-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = getContactGlyph(contact.type);

      const meta = document.createElement("div");
      const label = document.createElement("span");
      label.className = "contact-label";
      label.textContent = contact.label;

      const value = document.createElement("span");
      value.className = "contact-value";
      value.textContent = contact.value;

      meta.append(label, value);
      link.append(icon, meta);
      card.appendChild(link);

      if (editMode) {
        const actions = document.createElement("div");
        actions.className = "item-actions no-print";

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "btn btn-outline btn-xs";
        editBtn.textContent = "تعديل";
        editBtn.addEventListener("click", () => openEditContactModal(contact.id));

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "btn btn-danger-outline btn-xs";
        delBtn.textContent = "حذف";
        delBtn.addEventListener("click", () => {
          state.contacts = state.contacts.filter((c) => c.id !== contact.id);
          saveState("تم حذف وسيلة التواصل");
          renderContacts();
        });

        actions.append(editBtn, delBtn);
        card.appendChild(actions);
      }

      contactsList.appendChild(card);
    });
  }

  function renderEditVisibility() {
    toggleEditBtn.setAttribute("aria-pressed", String(editMode));
    toggleEditLabel.textContent = editMode ? "إنهاء التحرير" : "وضع التحرير";
    editToolbar.hidden = !editMode;
    avatarControls.hidden = !editMode;
    profileView.hidden = editMode;
    profileEditForm.hidden = !editMode;
    addSkillForm.hidden = !editMode;
    addContactForm.hidden = !editMode;
  }

  function renderAll() {
    renderEditVisibility();
    renderProfile();
    renderSkills();
    renderContacts();
  }

  function openEditSkillModal(skillId) {
    const skill = state.skills.find((s) => s.id === skillId);
    if (!skill) return;

    modalTitle.textContent = "تعديل المهارة";
    modalForm.innerHTML = `
      <div class="field">
        <label for="modal-skill-name">اسم المهارة</label>
        <input type="text" id="modal-skill-name" required maxlength="80" />
      </div>
      <div class="field">
        <label for="modal-skill-level">المستوى (10 - 100)</label>
        <input type="number" id="modal-skill-level" min="10" max="100" required />
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline" id="modal-cancel">إلغاء</button>
        <button type="submit" class="btn btn-primary">حفظ التعديل</button>
      </div>
    `;

    const nameInput = document.getElementById("modal-skill-name");
    const levelInput = document.getElementById("modal-skill-level");
    nameInput.value = skill.name;
    levelInput.value = String(skill.level);

    document.getElementById("modal-cancel").addEventListener("click", closeModal);
    modalForm.onsubmit = (e) => {
      e.preventDefault();
      const nextName = nameInput.value.trim();
      if (!nextName) return;
      skill.name = nextName;
      skill.level = clampNumber(Number(levelInput.value) || 80, 10, 100);
      saveState("تم تحديث المهارة");
      closeModal();
      renderSkills();
    };

    editModal.hidden = false;
  }

  function openEditContactModal(contactId) {
    const contact = state.contacts.find((c) => c.id === contactId);
    if (!contact) return;

    modalTitle.textContent = "تعديل وسيلة التواصل";
    modalForm.innerHTML = `
      <div class="field">
        <label for="modal-contact-type">النوع</label>
        <select id="modal-contact-type">
          <option value="email">بريد إلكتروني</option>
          <option value="whatsapp">واتساب</option>
          <option value="phone">هاتف</option>
          <option value="linkedin">لينكدإن</option>
          <option value="github">GitHub</option>
          <option value="website">موقع إلكتروني / رابط</option>
        </select>
      </div>
      <div class="field">
        <label for="modal-contact-label">العنوان الظاهر</label>
        <input type="text" id="modal-contact-label" required maxlength="50" />
      </div>
      <div class="field">
        <label for="modal-contact-value">القيمة أو الرابط</label>
        <input type="text" id="modal-contact-value" required maxlength="160" />
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline" id="modal-cancel">إلغاء</button>
        <button type="submit" class="btn btn-primary">حفظ التعديل</button>
      </div>
    `;

    const typeSel = document.getElementById("modal-contact-type");
    const labelIn = document.getElementById("modal-contact-label");
    const valIn = document.getElementById("modal-contact-value");
    typeSel.value = contact.type;
    labelIn.value = contact.label;
    valIn.value = contact.value;

    document.getElementById("modal-cancel").addEventListener("click", closeModal);
    modalForm.onsubmit = (e) => {
      e.preventDefault();
      const nextLabel = labelIn.value.trim();
      const nextVal = valIn.value.trim();
      if (!nextLabel || !nextVal) return;
      contact.type = typeSel.value;
      contact.label = nextLabel;
      contact.value = nextVal;
      saveState("تم تحديث وسيلة التواصل");
      closeModal();
      renderContacts();
    };

    editModal.hidden = false;
  }

  function closeModal() {
    editModal.hidden = true;
    modalForm.innerHTML = "";
    modalForm.onsubmit = null;
  }

  // Event Listeners
  toggleEditBtn.addEventListener("click", () => {
    editMode = !editMode;
    renderAll();
    showToast(editMode ? "تم تفعيل وضع التحرير" : "تم حفظ التعديلات وإغلاق التحرير");
  });

  printBtn.addEventListener("click", () => {
    window.print();
  });

  [inputName, inputBadge, inputTitle, inputBio].forEach((el) => {
    el.addEventListener("input", () => {
      state.name = inputName.value.trim() || "خديجة إبراهيم";
      state.badge = inputBadge.value;
      state.title = inputTitle.value.trim() || "مصممة ومطوّرة واجهات ويب";
      state.bio = inputBio.value;
      saveState();
      topbarName.textContent = state.name;
      profileName.textContent = state.name;
      profileBadge.textContent = state.badge;
      profileBadge.hidden = !state.badge.trim();
      profileTitle.textContent = state.title;
      profileBio.textContent = state.bio;
      avatarFallback.textContent = getInitials(state.name);
    });
  });

  avatarUpload.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 640, 140 * 1024);
      state.avatar = compressed;
      saveState("تم ضغط الصورة الشخصية وحفظها");
      renderProfile();
    } catch {
      showToast("تعذر قراءة الصورة المختارة، يرجى تجربة صورة أخرى.");
    } finally {
      avatarUpload.value = "";
    }
  });

  avatarRemoveBtn.addEventListener("click", () => {
    state.avatar = "";
    saveState("تم حذف الصورة الشخصية");
    renderProfile();
  });

  profileAvatar.addEventListener("error", () => {
    profileAvatar.hidden = true;
    avatarFallback.hidden = false;
  });

  addSkillForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = newSkillName.value.trim();
    if (!name) return;
    const level = clampNumber(Number(newSkillLevel.value) || 85, 10, 100);
    state.skills.push({ id: `sk-${Date.now()}`, name, level });
    newSkillName.value = "";
    newSkillLevel.value = "85";
    saveState("تمت إضافة المهارة بنجاح");
    renderSkills();
  });

  addContactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const label = newContactLabel.value.trim();
    const value = newContactValue.value.trim();
    if (!label || !value) return;
    state.contacts.push({
      id: `ct-${Date.now()}`,
      type: newContactType.value,
      label,
      value
    });
    newContactLabel.value = "";
    newContactValue.value = "";
    saveState("تمت إضافة وسيلة التواصل");
    renderContacts();
  });

  exportBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("تم تصدير ملف data.json بنجاح");
  });

  importFile.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        state = normalizeState(parsed);
        saveState("تم استيراد البيانات وتطبيقها");
        renderAll();
      } catch {
        showToast("ملف JSON غير صالح، تأكد من اختيار ملف data.json صحيح.");
      } finally {
        importFile.value = "";
      }
    };
    reader.readAsText(file, "utf-8");
  });

  resetBtn.addEventListener("click", () => {
    if (!window.confirm("هل تريد استعادة البيانات الافتراضية وحذف التعديلات المحفوظة؟")) return;
    localStorage.removeItem(STORAGE_KEY);
    state = cloneDefaults();
    renderAll();
    showToast("تمت استعادة الإعدادات الافتراضية");
  });

  modalCloseBtn.addEventListener("click", closeModal);
  editModal.addEventListener("click", (e) => {
    if (e.target === editModal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !editModal.hidden) closeModal();
  });

  renderAll();
})();
