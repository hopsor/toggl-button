function createTag(name, className, child) {
  var tag = document.createElement(name);
  tag.className = className;
  
  if (child !== undefined) {
    if (typeof child === 'string') {
      child = document.createTextNode(child);
    }
    tag.appendChild(child);
  }
  return tag;
}

(function () {
  window.addEventListener("message", function(event) {
    if(event.data.command == "setDescription"){
      document.getElementById('toggl_task_description').value = event.data.description;
    }
  });
  
  document.getElementById('toggl_submit').addEventListener("click", function(event){
    var description = document.getElementById('toggl_task_description').value;
    window.parent.postMessage({command: 'submitEntry', description: description}, '*');
  });

  document.getElementById('toggl_cancel').addEventListener("click", function(event){
    window.parent.postMessage({command: 'closeToggl'}, '*');
  });

  document.getElementById('toggl_project').addEventListener("change", function(event){
    chrome.extension.sendMessage({type: 'setProjectId', pid: this.value});
  });

  // Load select options
  chrome.extension.sendMessage({type: 'getOptions'}, function(data){
    var groups = {},
        workspaces = data.workspaces,
        projects = data.projects,
        select = document.getElementById('toggl_project');

    select.appendChild(createTag('option', 'meta-option', "none")).value = 'default';

    // Create one optgroup per workspace.
     for (var i = 0; i < workspaces.length; i++) {
        groups[workspaces[i].id] = select.appendChild(createTag('optgroup'));
        groups[workspaces[i].id].label = workspaces[i].name;
     }

     // Add the projects to their workspace's group.
     for (var i = 0; i < projects.length; i++) {
       var proj = projects[i];
       var opt = groups[proj.wid].appendChild(createTag('option', '', proj.name));
       opt.value = proj.id;
     }
  });
}());