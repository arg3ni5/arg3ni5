(function () {
    const skillLabels = {
        backend: "Backend",
        frontend: "Frontend",
        database: "Bases de datos",
        qaAndTools: "QA y herramientas",
        professional: "Competencias profesionales"
    };

    function $(selector, root = document) {
        return root.querySelector(selector);
    }

    function createElement(tag, attrs = {}) {
        const node = document.createElement(tag);

        Object.entries(attrs).forEach(([key, value]) => {
            if (value === undefined || value === null) return;

            if (key === "textContent" || key === "className") {
                node[key] = value;
                return;
            }

            node.setAttribute(key, value);
        });

        return node;
    }

    function clear(node) {
        if (node) node.replaceChildren();
    }

    function formatList(items, separator = " · ") {
        return Array.isArray(items) ? items.filter(Boolean).join(separator) : "";
    }

    function phoneToHref(phone) {
        return `tel:${String(phone || "").replace(/[^\d+]/g, "")}`;
    }

    function getProfileDescription(profile) {
        if (typeof profile === "string") return profile;
        return profile?.description || "";
    }

    function renderBasics(data) {
        const basics = data.basics || {};
        const displayRole = basics.headline || basics.role || "";

        const name = $("#name");
        const role = $("#role");
        const location = $("#location");

        if (name) name.textContent = basics.name || "";
        if (role) role.textContent = displayRole;
        if (location) location.textContent = basics.location || "";

        if (basics.name) document.title = `${basics.name} - CV`;

        const emailLink = $("#email-link");
        const footerEmailLink = $("#footer-email-link");
        if (basics.email) {
            [emailLink, footerEmailLink].forEach((link) => {
                if (!link) return;
                link.href = `mailto:${basics.email}`;
                link.setAttribute("aria-label", `Enviar correo a ${basics.email}`);
            });
        }

        const phoneLink = $("#phone-link");
        if (phoneLink && basics.phone) {
            phoneLink.href = phoneToHref(basics.phone);
            phoneLink.setAttribute("aria-label", `Llamar al teléfono ${basics.phone}`);
        }

        const linkedinLink = $("#linkedin-link");
        if (linkedinLink && basics.linkedin) {
            linkedinLink.href = basics.linkedin;
            linkedinLink.setAttribute("aria-label", `Abrir LinkedIn de ${basics.name || "Fabián Chinchilla"}`);
        }

        const githubLink = $("#github-link");
        if (githubLink && basics.github) {
            githubLink.href = basics.github;
            githubLink.setAttribute("aria-label", `Abrir GitHub de ${basics.github.replace(/\/$/, "").split("/").pop()}`);
        }

        const footer = $("footer p");
        if (footer) {
            const year = $("#y")?.textContent || new Date().getFullYear();
            footer.textContent = "";
            footer.append("© ");
            footer.append(createElement("span", { id: "y", textContent: year }));
            footer.append(` ${basics.name || ""} · ${basics.location || ""}`);
        }
    }

    function renderProfile(data) {
        const profileText = $("#perfil-texto");
        if (profileText) profileText.textContent = getProfileDescription(data.profile);
    }

    function renderSkills(skills) {
        const container = $("#skills");
        if (!container) return;

        clear(container);

        if (Array.isArray(skills)) {
            const list = createElement("div", { className: "chips", role: "list" });
            skills.forEach((skill) => {
                list.appendChild(createElement("span", { className: "chip", role: "listitem", textContent: skill }));
            });
            container.appendChild(list);
            return;
        }

        Object.entries(skills || {}).forEach(([category, items]) => {
            if (!Array.isArray(items) || items.length === 0) return;

            const group = createElement("section", { className: "skill-group" });
            group.appendChild(createElement("h3", {
                className: "skill-title",
                textContent: skillLabels[category] || category
            }));

            const list = createElement("div", {
                className: "chips",
                role: "list",
                "aria-label": skillLabels[category] || category
            });

            items.forEach((skill) => {
                list.appendChild(createElement("span", { className: "chip", role: "listitem", textContent: skill }));
            });

            group.appendChild(list);
            container.appendChild(group);
        });
    }

    function renderEducation(education = []) {
        const list = $("#education");
        if (!list) return;

        clear(list);

        education.forEach((item) => {
            const li = createElement("li");
            li.appendChild(createElement("strong", { textContent: item.degree || item.title || "" }));

            const details = [item.institution || item.org, item.period, item.location].filter(Boolean);
            if (details.length) li.append(` - ${details.join(" · ")}`);

            list.appendChild(li);
        });
    }

    function renderCertifications(certifications = []) {
        const title = $("#certificaciones");
        const list = $("#certs");
        if (!list) return;

        clear(list);

        const hasCertifications = Array.isArray(certifications) && certifications.length > 0;
        if (title) title.hidden = !hasCertifications;
        list.hidden = !hasCertifications;

        certifications.forEach((certification) => {
            list.appendChild(createElement("li", { textContent: certification }));
        });
    }

    function renderLanguages(languages = []) {
        const list = $("#langs");
        if (!list) return;

        clear(list);

        languages.forEach((language) => {
            list.appendChild(createElement("li", {
                textContent: [language.name, language.level].filter(Boolean).join(" - ")
            }));
        });
    }

    function renderExperience(experience = []) {
        const container = $("#experience");
        if (!container) return;

        clear(container);

        experience.forEach((item, index) => {
            const article = createElement("article", { className: "exp-item", role: "listitem" });
            const title = [item.position || item.title, item.company].filter(Boolean).join(" - ");
            const meta = [item.period, item.location].filter(Boolean).join(" · ");

            article.appendChild(createElement("h3", { className: "exp-title", textContent: title }));

            if (meta) {
                article.appendChild(createElement("p", { className: "exp-meta", textContent: meta }));
            }

            if (item.companyDescription) {
                article.appendChild(createElement("p", {
                    className: "exp-description",
                    textContent: item.companyDescription
                }));
            }

            const technologies = formatList(item.technologies);
            if (technologies) {
                article.appendChild(createElement("p", {
                    className: "exp-tech",
                    textContent: technologies
                }));
            }

            const highlights = item.highlights || item.bullets || [];
            if (highlights.length) {
                const list = createElement("ul", { className: "exp-list" });
                highlights.forEach((highlight) => {
                    list.appendChild(createElement("li", { textContent: highlight }));
                });
                article.appendChild(list);
            }

            container.appendChild(article);

            if (index < experience.length - 1) {
                container.appendChild(createElement("div", {
                    className: "exp-divider",
                    role: "separator",
                    "aria-hidden": "true"
                }));
            }
        });
    }

    function renderProjects(projects = []) {
        const container = $("#projects");
        if (!container) return;

        clear(container);

        projects.forEach((project) => {
            const article = createElement("article", { className: "project-item", role: "listitem" });
            article.appendChild(createElement("h3", { className: "project-title", textContent: project.name || "" }));

            const meta = [project.type, project.relatedCompany].filter(Boolean).join(" · ");
            if (meta) article.appendChild(createElement("p", { className: "project-meta", textContent: meta }));
            if (project.summary) article.appendChild(createElement("p", { textContent: project.summary }));

            const technologies = formatList(project.technologies);
            if (technologies) {
                article.appendChild(createElement("p", {
                    className: "project-tech",
                    textContent: technologies
                }));
            }

            container.appendChild(article);
        });
    }

    function renderAdditionalExperience(items = []) {
        const list = $("#additional-experience");
        if (!list) return;

        clear(list);

        items.forEach((item) => {
            const li = createElement("li");
            li.appendChild(createElement("strong", { textContent: item.title || "" }));
            if (item.description) li.append(` - ${item.description}`);
            list.appendChild(li);
        });
    }

    function renderJsonViewer(data) {
        const output = $("#json-out");
        if (output) output.textContent = JSON.stringify(data, null, 2);
    }

    function setFooterYear() {
        const year = $("#y");
        if (year) year.textContent = new Date().getFullYear();
    }

    function bindActions() {
        const printButton = $("#print-button");
        if (printButton) {
            printButton.addEventListener("click", () => window.print());
        }
    }

    function render(data) {
        setFooterYear();
        renderBasics(data);
        renderProfile(data);
        renderSkills(data.skills);
        renderEducation(data.education);
        renderCertifications(data.certifications);
        renderLanguages(data.languages);
        renderExperience(data.experience);
        renderProjects(data.projects);
        renderAdditionalExperience(data.additionalExperience);
        renderJsonViewer(data);
    }

    async function loadCv() {
        try {
            const response = await fetch("./data/cv.json");
            if (!response.ok) {
                throw new Error(`No se pudo cargar ./data/cv.json: ${response.status}`);
            }

            const data = await response.json();
            render(data);
        } catch (error) {
            console.error("Error al cargar el CV:", error);
        }
    }

    bindActions();
    loadCv();
})();
