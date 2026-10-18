from typing import List, Dict, Any
import datetime

class ExportService:
    @staticmethod
    def generate_ics(actions: List[Dict[str, Any]]) -> str:
        """
        Generates standard iCalendar (.ics) string for imported action items.
        """
        lines = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Nivorq Enterprise AI//Action Planner//EN",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH"
        ]

        now_str = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ")

        for act in actions:
            due_date = act.get("due_date", "2026-10-30").replace("-", "")
            lines.extend([
                "BEGIN:VEVENT",
                f"UID:{act.get('id', 'act-001')}@nivorq.enterprise.internal",
                f"DTSTAMP:{now_str}",
                f"DTSTART;VALUE=DATE:{due_date}",
                f"SUMMARY:[Nivorq Action] {act.get('title', 'Task')}",
                f"DESCRIPTION:Assignee: {act.get('assignee', 'Unassigned')}\\nPriority: {act.get('priority', 'MEDIUM')}\\nDepartment: {act.get('department', 'General')}",
                f"STATUS:CONFIRMED",
                "END:VEVENT"
            ])

        lines.append("END:VCALENDAR")
        return "\r\n".join(lines)

    @staticmethod
    def generate_jira_payload(actions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Formats action items into standard Atlassian Jira REST API bulk issue creation format.
        """
        issue_updates = []
        for act in actions:
            issue_updates.append({
                "fields": {
                    "project": {"key": "NIVORQ"},
                    "summary": act.get("title", "Action Item"),
                    "description": f"Automated Task extracted by Nivorq Copilot.\nAssignee: {act.get('assignee')}\nPriority: {act.get('priority')}\nDepartment: {act.get('department')}",
                    "issuetype": {"name": "Task"},
                    "priority": {"name": "High" if act.get("priority") == "CRITICAL" else "Medium"},
                    "duedate": act.get("due_date", "2026-10-30")
                }
            })

        return {"issueUpdates": issue_updates}

export_service = ExportService()
